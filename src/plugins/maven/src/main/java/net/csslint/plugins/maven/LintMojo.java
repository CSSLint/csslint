/*
Copyright (c) 2011, Tomasz Oponowicz
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

- Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

package net.csslint.plugins.maven;

import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.codehaus.plexus.util.FileUtils;
import org.codehaus.plexus.util.io.RawInputStreamFacade;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.tools.shell.Global;
import org.mozilla.javascript.tools.shell.Main;
import org.mozilla.javascript.tools.shell.QuitAction;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.List;

/**
 * A Maven plugin for CSS Lint tool.
 *
 * @goal check
 * @phase verify
 */
public class LintMojo extends AbstractMojo {
    private static final String SCRIPT_FILE = "csslint-rhino.js";
    private static final String OUTPUT_FILE = "csslint.xml";

    private int scriptExitCode;

    /**
     * List of rules that the tool uses
     * (if not specified all available rules are applied).
     * <p/>
     * Available rules:
     * <ul>
     * <li>adjoining-classes : Don't use adjoining classes</li>
     * <li>box-model : Beware of broken box model</li>
     * <li>compatible-vendor-prefixes : Use compatible vendor prefixes</li>
     * <li>display-property-grouping : Use properties appropriate for
     *     'display'</li>
     * <li>duplicate-properties : Avoid duplicate properties</li>
     * <li>empty-rules : Disallow empty rules</li>
     * <li>floats : Don't use too many floats</li>
     * <li>font-faces : Don't use too many web fonts</li>
     * <li>font-sizes : Don't use too many font sizes</li>
     * <li>gradients : Include all gradient definitions</li>
     * <li>ids : Don't use IDs</li>
     * <li>import : Avoid '@import'</li>
     * <li>important : Disallow '!important'</li>
     * <li>overqualified-elements : Don't use overqualified elements</li>
     * <li>qualified-headings : Don't qualify headings</li>
     * <li>regex-selectors : Don't use selectors that look like regexs</li>
     * <li>text-indent : Don't use negative text-indent'</li>
     * <li>unique-headings : Heading should only be defined once</li>
     * <li>vendor-prefix : Use vendor prefix properties correctly</li>
     * <li>zero-units : Don't use units for 0 values</li>
     * </ul>
     *
     * @parameter
     * @optional
     */
    private List<String> rules;

    /**
     * List of files or directories that the tool processes.
     * <p/>
     * The path can be absolute or relative (to ${basedir}).
     * Tool is looking for *.css files when directory is defined.
     *
     * @parameter
     * @required
     */
    private List<String> includes;

    /**
     * Output format. Choose between "text" and "lint-xml".
     * <p/>
     * Formats:
     * <ul>
     * <li>"text" is console logger</li>
     * <li>"lint-xml" is XML file logger (the location of the
     *     file is "${project.build.directory}/csslint.xml")</li>
     * </ul>
     *
     * @parameter
     * @optional
     */
    private String format;

    /**
     * Absolute path to project build directory.
     *
     * @parameter expression="${project.build.directory}"
     * @readonly
     * @required
     */
    private File projectBuildDirectory;

    /**
     * Validate inputs, build arguments and execute CSS Lint tool.
     *
     * @throws MojoExecutionException if input validation fails
     */
    @Override
    public void execute() throws MojoExecutionException {
        List<String> arguments = new ArrayList<String>();

        validateInput();

        setSoftQuit();

        // Build arguments list
        addScriptArgument(arguments);
        addRulesArgument(arguments);
        addOutputArgument(arguments);
        addIncludesArgument(arguments);

        // Invoke script with specified arguments by means Rhino
        int exitCode = Main.exec(arguments.
                toArray(new String[arguments.size()]));

        if (exitCode != 0) {
            throw new IllegalStateException("Error occurs when " +
                    "executing CSS Lint tool");
        }

        if (scriptExitCode != 0) {
            throw new IllegalStateException("There are errors in " +
                    "your CSS files");
        }
    }

    private void validateInput() throws MojoExecutionException {
        if (includes == null || includes.isEmpty()) {
            throw new MojoExecutionException("You have to define " +
                    "file to process");
        }
    }

    private void addIncludesArgument(List<String> arguments) {
        arguments.addAll(includes);
    }

    private void addOutputArgument(List<String> arguments) {
        assert arguments != null;

        if ("lint-xml".equals(format)) {
            getLog().debug("Use XML file logger");

            arguments.add("--format=" + format);

            try {
                setOutputFile();
            } catch (FileNotFoundException e) {
                throw new RuntimeException(e);
            }
        } else {
            getLog().debug("Use console logger");
        }
    }

    private void addRulesArgument(List<String> arguments) {
        assert  arguments != null;

        if (rules != null && !rules.isEmpty()) {

            getLog().debug(String.format("Apply custom rules set, which was " +
                    "specified by user, rules='%s'", rules));

            StringBuilder sb = new StringBuilder();

            sb.append("--rules=");

            for (String rule : rules) {
                sb.append(rule);
                sb.append(',');
            }

            // Remove last ',' character
            sb.deleteCharAt(sb.length() - 1);

            arguments.add(sb.toString());
        } else {
            getLog().debug("Apply all available rules, because user " +
                    "didn't specify any custom set");
        }
    }

    private void addScriptArgument(List<String> arguments) {
        File script = getFileFromBuildDirectory(SCRIPT_FILE);

        /*
            'csslint-rhino.js' script exists in classpath. The Rhino accepts
            only file's path or URL. Thus loading script from classpath
            is impossible. Extract script to temporary directory and use.

            There is workaround, which enables defining custom protocol,
            but it isn't total valid in this situation (overriding global
            @link(URLStreamHandlerFactory} doesn't sound elegant):

            http://stackoverflow.com/questions/861500/
            url-to-load-resources-from-the-classpath-in-java
         */

        /*
            FIXME
            File's name should contain version to avoid unexpected
            behaviour when switching between different version of plugin
            without cleaning workspace
         */
        if (!script.exists()) {

            getLog().debug(String.format("Extract script to build " +
                    "directory, script='%s'", script.getAbsolutePath()));

            try {
                extractFileFromClasspath(script);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        } else {
            getLog().debug(String.format("Script already exists in build " +
                    "directory, thus skip extracting, script='%s'",
                    script.getAbsolutePath()));
        }

        arguments.add(script.getAbsolutePath());
    }

    private void setSoftQuit() {

        /*
            By default Main class use System.exit() method to quit from script.
            In our case this is incorrect action because the whole Maven process
            is terminated. Thus we simulate "soft quit". This initialization
            has to be invoked before any interaction with Main class.

            This piece of code can be confused because it modifies static
            fields so other plugins can be affected. However this is
            impossible because for each plugin used by a project, a plugin
            class loader is created. For more information:

            https://cwiki.apache.org/MAVEN/maven-3x-class-loading.html
         */

        Main.global = new Global();
        Main.getGlobal().initQuitAction(new QuitAction() {

            @Override
            public void quit(Context cx, int exitCode) {

                // Pass exit code from "csslint-rhino.js" script
                scriptExitCode = exitCode;
            }
        });
    }

    private File getFileFromBuildDirectory(String path) {
        return new File(projectBuildDirectory, path);
    }

    private void setOutputFile() throws FileNotFoundException {
        Main.setOut(new PrintStream(getFileFromBuildDirectory(OUTPUT_FILE)));
    }

    private void extractFileFromClasspath(File script) throws IOException {
        FileUtils.copyStreamToFile(getScriptAsInputStream(), script);
    }

    private RawInputStreamFacade getScriptAsInputStream() throws IOException {
        return new RawInputStreamFacade(
                LintMojo.class.getClassLoader()
                        .getResource(SCRIPT_FILE).openStream());
    }
}
