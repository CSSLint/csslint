assert new File( basedir, "target/csslint.xml" ).exists();

def output = new XmlSlurper().parse(new File( basedir, "target/csslint.xml" ));

assert output != null
assert output.file.issue.size() == 11