import os, sys, json, subprocess as sp
import urllib2

directories = [f for f in os.listdir(".") 
                 if os.path.isdir(f)
                 and "test" in f]

# this reduces the recursive search for children
test_files = {  os.path.join(path, f)
                for dir in directories
                for path, dirs, files in os.walk(dir)
                for f in files
                if f.endswith(".js") }

# open ONLY if gulp is already there...
try:
    # HEAD request
    urllib2.urlopen("http://localhost:5001/").info()
except urllib2.URLError:
    print("RUN GULP IN PARALLEL FIRST")
    sys.exit()

for test_file in test_files:
    cmd = ["mocha", os.path.abspath(test_file)]
    # print(" ".join(cmd))
    process = sp.Popen(cmd, shell=True)
    process.wait()
