const path = require('path')
const fs = require('fs')
const ShellExec = require('./lib/ShellExec')

const prependFilenameInFolder = require('./lib/prependFilenameInFolder')
const isColab = require('./lib/isColab')

let processSinglePDF = async function (file) {
  let filename = path.basename(file)
  // let dirname = path.dirname(file)
  let filenameNoExt = filename
  if (filenameNoExt.endsWith('.pdf')) {
    filenameNoExt = filenameNoExt.slice(0, -4)
  }

  let outputFolder = `/cache/${filenameNoExt}/`
  console.log({outputFolder})
  fs.mkdirSync(outputFolder, {recursive: true})

  let result

  let cmd = `pdftoppm "${file}" "/cache/${filenameNoExt}" -png`
  console.log(cmd)
  try {
    result = await ShellExec(cmd)
  }
  catch (e) {
    console.error(e)
  }

  // --------------------------------

  try {
    await ShellExec(`convert "/cache/${filenameNoExt}*.png" /output/${filenameNoExt}-images.pdf`)
  }
  catch (e) {
    console.error(e)
  }

  // --------------------------------

  prependFilenameInFolder(filenameNoExt, outputFolder)

  // if (isColab) {
  //   await ShellSpawn(`cd "${outputFolder}"; zip -r ../"${filenameNoExt}.zip" . -i *`)
  // }
}

module.exports = processSinglePDF