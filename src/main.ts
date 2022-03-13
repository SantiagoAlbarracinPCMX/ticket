/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { generateHtml } from './generateHtml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

//Genero el html
async function HTMLGenerate(): Promise<void> {
  return await new Promise((res, err) => {
    const fs = require('fs');
    const fileName = './test.html';
    const stream = fs.createWriteStream(fileName);
    stream.once('open', function () {
      const html = generateHtml();
      stream.end(html);
      res();
    });
  });
}

//Genero el pdf
async function PDFGenerate(): Promise<any> {
  const fs = require('fs');
  const pdf = require('html-pdf');
  const options = { height: '842', width: '595' };

  //Genero el archivo HTML
  const response: any = await HTMLGenerate();

  //Leo el archivo HTML generado y lo genero como pdf
  const htmlFile = fs.readFileSync('./test.html', 'utf8');
  pdf.create(htmlFile, options).toFile('./ticket.pdf', function (err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }
  });
  return response;
}

bootstrap();
PDFGenerate();
