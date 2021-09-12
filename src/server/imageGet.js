const https = require('https')
const fs = require('fs')
const token = require('../bot/token.js')

async function getImage(file_id,callback){ //AgACAgIAAxkBAAIDI2E8UIGWbm5mHpp9bkttBrcVqHplAAK8tDEb_orRSbRJ346YcTECAQADAgADeAADIAQ
  return new Promise((resolve,rej)=>{

    const options = {
      hostname: 'api.telegram.org',
      // port: 443,
      path: `/bot${token}/getFile?file_id=${file_id}`,
      method: 'GET'
    }
    let file_object,file_info =''
    const req = https.request(options, res => {
      // console.log(`statusCode: ${res.statusCode}`)

      res.on('data', d => {
        // process.stdout.write(d)
        file_info+=d
      })

      res.on('end'/*'close'*//*both works LOL*/, async ()=> {
        // console.log('%s \r\nAAAAA ',JSON.parse(file_info))
        file_object = JSON.parse(file_info).result
        const file_name = await downloadImage(file_object)
        // console.log(file_name)
        resolve(file_name)
        // console.log(file_object)
      })
    })

    req.on('error', error => {
      // console.error(error)
    })

    // req.on('end',async()=>{
      
    // })

    req.end()
  })
}  

async function downloadImage(file_object){
  return new Promise((resolve,rej)=>{
  const options = {
    hostname: 'api.telegram.org',
    // port: 443,
    path: `/file/bot${token}/${file_object.file_path}`,
    method: 'GET'
  }
  let file = fs.createWriteStream(`${__dirname}/../img/${file_object.file_id}_${file_object.file_path.replace('/','')}`)
  // let file_data = ''
    console.log('server 1')

  const req = https.request(options, res => {
    // console.log(`statusCode: ${res.statusCode}`,'downloadImage')
    console.log('server 2')

    // res.on('data',(d)=>file_data+=d)

    res.pipe(file)

    file.on('finish',()=>{
      // console.log('FINISH')
    console.log('server 3')

      resolve(file_object.file_id+'_'+file_object.file_path.replace('/',''))
    })
    // res.on('end',()=>console.log(file_data))
  })

  req.on('error', error => {
    // console.error(error)
  })
    
  req.end()

  })
  
}
  

// getImage('AgACAgIAAxkBAAIDI2E8UIGWbm5mHpp9bkttBrcVqHplAAK8tDEb_orRSbRJ346YcTECAQADAgADeAADIAQ')


module.exports = getImage
