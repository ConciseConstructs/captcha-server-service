const fs = require('fs')
let _this = { }
let path = 'compiled/src/'

fs.readdir(path, { encoding: 'utf8'}, (error, files)=> {
  if (error) console.log('error:', error)
  else onReadDirSuccess(files)
})

        function onReadDirSuccess(files) {
          createFindReplaceMappings()
          _this.targetFiles = files.filter(fileName => { return !fileName.includes('.js.map') })
          console.log('filtered:', _this.targetFiles)
          _this.targetFiles.forEach(file => correctModuleNames(file))
        }


                function createFindReplaceMappings() {
                  _this.findReplaceMap = {
                    "twilio_1.Twilio": "twilio_1",
                    "braintree_1.braintree": "braintree_1",
                    "nodemailer_1.nodemailer": "nodemailer_1",
                    "aws_sdk_1.AWS.": "aws_sdk_1."
                  }
                }


                function correctModuleNames(file) {
                  fs.readFile(`${ path }${ file }`,'utf8', (error, contents)=> {
                    if (error) console.log(`Error reading file: ${ file }`)
                    else {
                      for (let [ find, replace ] of Object.entries(_this.findReplaceMap)) {
                        contents = contents.split(find).join(replace)
                      }
                    }
                    fs.writeFile(`${ path }${ file }`, contents, (error, success)=> {
                      if (error) console.log(`Error saving file: ${ file }`)
                      else console.log(`Saved file ${ file }`)
                    })
                  })
                }