assert !(new File( basedir, "target/csslint.xml" ).exists());

String allOutput = new File( basedir, "build.log" ).getText();
assert allOutput.contains("csslint: No errors in file1.css.");
assert allOutput.contains("BUILD SUCCESS");
