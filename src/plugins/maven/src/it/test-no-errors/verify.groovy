assert !(new File( basedir, "target/csslint.xml" ).exists());

String output = new File( basedir, "build.log" ).getText();
assert output.contains("csslint: No errors in file1.css.") == true;
assert output.contains("BUILD SUCCESS") == true;
