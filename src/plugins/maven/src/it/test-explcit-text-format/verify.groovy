assert !(new File( basedir, "target/csslint.xml" ).exists());

def allOutput = new File( basedir, "build.log" ).getText();
assert allOutput.contains("BUILD FAILURE");