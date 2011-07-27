assert new File( basedir, "target/csslint.xml" ).exists();

def pluginOutput = new XmlSlurper().parse(new File( basedir, "target/csslint.xml" ));
assert pluginOutput.file.issue.size() == 7

def allOutput = new File( basedir, "build.log" ).getText();
assert allOutput.contains("BUILD FAILURE");