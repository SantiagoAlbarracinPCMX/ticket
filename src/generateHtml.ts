/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */

import { PayItems } from "./Models/PayItems";

export function generateHtml(): string {
    const array: PayItems[] = [ new PayItems("Envío", 100),
                                new PayItems("Comisión Oxxo por envío", 200),
                                new PayItems("Comisión Oxxo por entrega de paquete", 300)
    ];

    return buildHtml(array);
}

function generateTrackQR() {
  const QRCode = require('qrcode');
  const path = require('path');
  const reqPath = path.join(__dirname, '../src/images/');
  const opts = {
    errorCorrectionLevel: 'H',
    type: 'image/jpeg',
    quality: 0.95,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFF',
    },
  };

  QRCode.toFile(`${reqPath}qr_trackeo.jpg`, 'https://skydropx.com/', opts);
}

/*  
  La funcion recibe como parametro una array con objetos de la clase PayItems. Estos seran asignados a las variables:
    *envioDesc
    *envioPrice
    *oxxoDesc
    *oxxoPrice
    *envioOxxoDesc
    *envioOxxoPrice
  
  La lista recibida como parametro debera contener al menos un objeto.
  Tambien se tienen constantes que corresponden a imagenes que se encuentran almacenadas y se utilizan en formato base64 en el HTML:
    *imgQRProhibidos
    *imgQRConsultas
    *imgArticulosProhibidos
    *imgCodigoBarra
    *imgLinea
    *imgEncabezado
    *imgEscanearCodigoBarra
    *imgQRBox
    *imgFinal
    *imgQRTrackeo
*/
function buildHtml(listPayItems: PayItems[]): string {
  const path = require('path');
  const fs = require('fs');
  const reqPath = path.join(__dirname, '../src/images/');

  generateTrackQR();

  //Conversion de imagenes a base64
  const imgQRTrackeo = fs.readFileSync(`${reqPath}qr_trackeo.jpg`, 'base64');
  const imgQRProhibidos = fs.readFileSync(`${reqPath}qr_prohibidos.jpg`, 'base64');
  const imgQRConsultas = fs.readFileSync(`${reqPath}qr_consultas.jpg`, 'base64');
  const imgArticulosProhibidos = fs.readFileSync(`${reqPath}articulos_prohibidos.jpg`, 'base64');
  const imgCodigoBarra = fs.readFileSync(`${reqPath}codigo_barra.jpg`, 'base64');
  const imgLinea = fs.readFileSync(`${reqPath}linea.jpg`, 'base64');
  const imgEncabezado = fs.readFileSync(`${reqPath}encabezado.jpg`, 'base64');
  const imgEscanearCodigoBarra = fs.readFileSync(`${reqPath}escanear_codigo.jpg`, 'base64');
  const imgQRBox = fs.readFileSync(`${reqPath}box_qr_prohibido.jpg`, 'base64');
  const imgFinal = fs.readFileSync(`${reqPath}final.jpg`, 'base64');

  //Declaracion de variable para almacenar la sumatoria de los precios de cada servicio recibido en listPayItems.
  let totalPrice = listPayItems[0].price;

  //Declaracion de variables para servicio y precio. Varían segun los parametros existentes en listPayItems.
  const envioDesc = listPayItems[0].description;
  const envioPrice = listPayItems[0].price;
  let oxxoDesc="";
  let oxxoPrice;
  let envioOxxoDesc="";
  let envioOxxoPrice;
  
  //Asignacion de valores a los parametros para precio y servicio, segun la cantidad de parametros que contenga listPayItems.
  switch (listPayItems.length) {
    case 1:
      oxxoPrice = "";
      envioOxxoPrice = "";
      break;

    case 2:
      totalPrice += listPayItems[1].price;
      oxxoDesc = listPayItems[1].description;
      oxxoPrice = listPayItems[1].price;
      envioOxxoPrice = "";
      break;

    case 3:
      totalPrice += listPayItems[1].price + listPayItems[2].price;
      oxxoDesc = listPayItems[1].description;
      oxxoPrice = listPayItems[1].price;
      envioOxxoDesc = listPayItems[2].description;
      envioOxxoPrice = listPayItems[2].price;
      break;
   
  }

  //Seteo de la fecha del sistema con formato correspondiente DD MMM YYYY hh:mm
  const systemDate = new Date();
  const arrayDate = systemDate.toLocaleString().split(" ");
  const date = 'Fecha:\t' + dateConverter(arrayDate[0]) + '\n' + 'Hora:\t' + arrayDate[1]  + ' h';

  //Cadenas con el codigo HTML del ticket
  const header ='<!DOCTYPE html><html><head><meta charset="UTF-8>\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Ticket</title>\n';
  const body = `
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr><td width="50%">&nbsp;</td><td align="center">
  
  <a name="JR_PAGE_ANCHOR_0_1"></a>
  <table class="jrPage" data-jr-height="842" cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 595pt; background-color: white;">
  <tr valign="top" style="height:0">
  <td style="width:39pt"></td>
  <td style="width:4pt"></td>
  <td style="width:1pt"></td>
  <td style="width:2pt"></td>
  <td style="width:5pt"></td>
  <td style="width:8pt"></td>
  <td style="width:75pt"></td>
  <td style="width:12pt"></td>
  <td style="width:172pt"></td>
  <td style="width:3pt"></td>
  <td style="width:75pt"></td>
  <td style="width:151pt"></td>
  <td style="width:9pt"></td>
  <td style="width:4pt"></td>
  <td style="width:10pt"></td>
  <td style="width:42pt"></td>
  </tr>
  <tr valign="top" style="height:30pt">
  <td colspan="16">
  </td>
  </tr>
  <tr valign="top" style="height:55pt">
  <td>
  </td>
  <td colspan="14">
  <div style="width: 100%; height: 100%; position: relative;">
  <div style="position: absolute; overflow: hidden; width: 100%; height: 100%; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:527pt"></td>
  <td style="width:4pt"></td>
  </tr>
  <tr valign="top" style="height:52pt">
  <td style="pointer-events: auto; ">
  <img src="data:image/jpeg;base64,${imgEncabezado}" style="width: 527pt" alt=""/></td>
  <td>
  </td>
  </tr>
  </table>
  </div>
  <div style="position: relative; width: 100%; height: 100%; pointer-events: none; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:4pt"></td>
  <td style="width:527pt"></td>
  </tr>
  <tr valign="top" style="height:45pt">
  <td colspan="2">
  </td>
  </tr>
  <tr valign="top" style="height:10pt">
  <td>
  </td>
  <td style="pointer-events: auto; ">
  <img src="data:image/jpeg;base64,${imgLinea}" style="width: 527pt" alt=""/></td>
  </tr>
  </table>
  </div>
  </div>
  </td>
  <td>
  </td>
  </tr>
  <tr valign="top" style="height:6pt">
  <td colspan="16">
  </td>
  </tr>
  <tr valign="top" style="height:30pt">
  <td colspan="4">
  </td>
  <td colspan="4" style="text-indent: 0px; text-align: left;">
  <span style="font-family: 'DejaVu Sans', Arial, Helvetica, sans-serif; color: #000000; font-size: 10pt; line-height: 1.2578125;">${date}</span></td>
  <td colspan="8">
  </td>
  </tr>
  <tr valign="top" style="height:105pt">
  <td colspan="2">
  </td>
  <td colspan="13">
  <div style="width: 100%; height: 100%; position: relative;">
  <div style="position: absolute; overflow: hidden; width: 100%; height: 100%; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:3pt"></td>
  <td style="width:100pt"></td>
  <td style="width:424pt"></td>
  </tr>
  <tr valign="top" style="height:40pt">
  <td>
  </td>
  <td style="pointer-events: auto; text-indent: 0px; text-align: left;">
  <span style="font-family: Segoe UI Semibold; color: #000000; font-size: 13pt; line-height: 1.3300781;">SERVICIO</span></td>
  <td>
  </td>
  </tr>
  </table>
  </div>
  <div style="position: relative; width: 100%; height: 100%; pointer-events: none; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:527pt"></td>
  </tr>
  <tr valign="top" style="height:1pt">
  <td>
  </td>
  </tr>
  <tr valign="top" style="height:104pt">
  <td>
  <div style="width: 100%; height: 100%; position: relative;">
  <div style="position: absolute; overflow: hidden; width: 100%; height: 100%; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:403pt"></td>
  <td style="width:100pt"></td>
  <td style="width:24pt"></td>
  </tr>
  <tr valign="top" style="height:40pt">
  <td>
  </td>
  <td style="pointer-events: auto; text-indent: 0px; text-align: right;">
  <span style="font-family: Segoe UI Semibold; color: #000000; font-size: 13pt; line-height: 1.3300781;">PRECIO</span></td>
  <td>
  </td>
  </tr>
  </table>
  </div>
  <div style="position: relative; width: 100%; height: 100%; pointer-events: none; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:527pt"></td>
  </tr>
  <tr valign="top" style="height:27pt">
  <td>
  </td>
  </tr>
  <tr valign="top" style="height:77pt">
  <td>
  <div style="width: 100%; height: 100%; position: relative;">
  <div style="position: absolute; overflow: hidden; width: 100%; height: 100%; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:6pt"></td>
  <td style="width:350pt"></td>
  <td style="width:524pt"></td>
  </tr>
  <tr valign="top" style="height:35pt">
  <td>
  </td>
  <td style="pointer-events: auto; text-indent: 0px; text-align: left;">
  <span style="font-family: 'DejaVu Sans', Arial, Helvetica, sans-serif; color: #000000; font-size: 10pt; line-height: 1.2578125;">${envioDesc}</span></td>
  <td>
  </td>
  </tr>
  </table>
  </div>
  <div style="position: relative; width: 100%; height: 100%; pointer-events: none; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:527pt"></td>
  </tr>
  <tr valign="top" style="height:1pt">
  <td>
  </td>
  </tr>
  <tr valign="top" style="height:76pt">
  <td>
  <div style="width: 100%; height: 100%; position: relative;">
  <div style="position: absolute; overflow: hidden; width: 100%; height: 100%; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:403pt"></td>
  <td style="width:100pt"></td>
  <td style="width:24pt"></td>
  </tr>
  <tr valign="top" style="height:35pt">
  <td>
  </td>
  <td style="pointer-events: auto; text-indent: 0px; text-align: right;">
  <span style="font-family: 'DejaVu Sans', Arial, Helvetica, sans-serif; color: #000000; font-size: 10pt; line-height: 1.2578125;">${envioPrice}</span></td>
  <td>
  </td>
  </tr>
  </table>
  </div>
  <div style="position: relative; width: 100%; height: 100%; pointer-events: none; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:527pt"></td>
  </tr>
  <tr valign="top" style="height:22pt">
  <td>
  </td>
  </tr>
  <tr valign="top" style="height:54pt">
  <td>
  <div style="width: 100%; height: 100%; position: relative;">
  <div style="position: absolute; overflow: hidden; width: 100%; height: 100%; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:4pt"></td>
  <td style="width:320pt"></td>
  <td style="width:404pt"></td>
  </tr>
  <tr valign="top" style="height:35pt">
  <td>
  </td>
  <td style="pointer-events: auto; text-indent: 0px; text-align: left;">
  <span style="font-family: 'DejaVu Sans', Arial, Helvetica, sans-serif; color: #000000; font-size: 10pt; line-height: 1.2578125;">${oxxoDesc}</span></td>
  <td>
  </td>
  </tr>
  </table>
  </div>
  <div style="position: relative; width: 100%; height: 100%; pointer-events: none; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:527pt"></td>
  </tr>
  <tr valign="top" style="height:1pt">
  <td>
  </td>
  </tr>
  <tr valign="top" style="height:53pt">
  <td>
  <div style="width: 100%; height: 100%; position: relative;">
  <div style="position: absolute; overflow: hidden; width: 100%; height: 100%; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:403pt"></td>
  <td style="width:100pt"></td>
  <td style="width:24pt"></td>
  </tr>
  <tr valign="top" style="height:35pt">
  <td>
  </td>
  <td style="pointer-events: auto; text-indent: 0px; text-align: right;">
  <span style="font-family: 'DejaVu Sans', Arial, Helvetica, sans-serif; color: #000000; font-size: 10pt; line-height: 1.2578125;">${oxxoPrice}</span></td>
  <td>
  </td>
  </tr>
  </table>
  </div>
  <div style="position: relative; width: 100%; height: 100%; pointer-events: none; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:527pt"></td>
  </tr>
  <tr valign="top" style="height:22pt">
  <td>
  </td>
  </tr>
  <tr valign="top" style="height:31pt">
  <td>
  <div style="width: 100%; height: 100%; position: relative;">
  <div style="position: absolute; overflow: hidden; width: 100%; height: 100%; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:3pt"></td>
  <td style="width:175pt"></td>
  <td style="width:349pt"></td>
  </tr>
  <tr valign="top" style="height:35pt">
  <td>
  </td>
  <td style="pointer-events: auto; text-indent: 0px; text-align: left;">
  <span style="font-family: 'DejaVu Sans', Arial, Helvetica, sans-serif; color: #000000; font-size: 10pt; line-height: 1.2578125;">${envioOxxoDesc}</span></td>
  <td>
  </td>
  </tr>
  </table>
  </div>
  <div style="position: relative; width: 100%; height: 100%; pointer-events: none; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:527pt"></td>
  </tr>
  <tr valign="top" style="height:1pt">
  <td>
  </td>
  </tr>
  <tr valign="top" style="height:30pt">
  <td>
  <div style="width: 100%; height: 100%; position: relative;">
  <div style="position: absolute; overflow: hidden; width: 100%; height: 100%; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:403pt"></td>
  <td style="width:100pt"></td>
  <td style="width:24pt"></td>
  </tr>
  <tr valign="top" style="height:35pt">
  <td>
  </td>
  <td style="pointer-events: auto; text-indent: 0px; text-align: right;">
  <span style="font-family: 'DejaVu Sans', Arial, Helvetica, sans-serif; color: #000000; font-size: 10pt; line-height: 1.2578125;">${envioOxxoPrice}</span></td>
  <td>
  </td>
  </tr>
  </table>
  </div>
  <div style="position: relative; width: 100%; height: 100%; pointer-events: none; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:527pt"></td>
  </tr>
  <tr valign="top" style="height:14pt">
  <td>
  </td>
  </tr>
  <tr valign="top" style="height:10pt">
  <td style="pointer-events: auto; ">
  <img src="data:image/jpeg;base64,${imgLinea}" style="width: 527pt" alt=""/></td>
  </tr>
  <tr valign="top" style="height:6pt">
  <td>
  </td>
  </tr>
  </table>
  </div>
  </div>
  </td>
  </tr>
  </table>
  </div>
  </div>
  </td>
  </tr>
  </table>
  </div>
  </div>
  </td>
  </tr>
  </table>
  </div>
  </div>
  </td>
  </tr>
  </table>
  </div>
  </div>
  </td>
  </tr>
  </table>
  </div>
  </div>
  </td>
  </tr>
  </table>
  </div>
  </div>
  </td>
  </tr>
  </table>
  </div>
  </div>
  </td>
  <td>
  </td>
  </tr>
  <tr valign="top" style="height:4pt">
  <td colspan="16">
  </td>
  </tr>
  <tr valign="top" style="height:290pt">
  <td colspan="3">
  </td>
  <td colspan="10">
  <div style="width: 100%; height: 100%; position: relative;">
  <div style="position: absolute; overflow: hidden; width: 100%; height: 100%; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:3pt"></td>
  <td style="width:509pt"></td>
  </tr>
  <tr valign="top" style="height:83pt">
  <td colspan="2">
  </td>
  </tr>
  <tr valign="top" style="height:207pt">
  <td>
  </td>
  <td style="pointer-events: auto; ">
  <img src="data:image/jpeg;base64,${imgArticulosProhibidos}" style="height: 207pt" alt=""/></td>
  </tr>
  </table>
  </div>
  <div style="position: relative; width: 100%; height: 100%; pointer-events: none; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:377pt"></td>
  <td style="width:126pt"></td>
  <td style="width:7pt"></td>
  <td style="width:2pt"></td>
  </tr>
  <tr valign="top" style="height:91pt">
  <td colspan="3">
  <div style="width: 100%; height: 100%; position: relative;">
  <div style="position: absolute; overflow: hidden; width: 100%; height: 100%; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:510pt"></td>
  </tr>
  <tr valign="top" style="height:20pt">
  <td>
  </td>
  </tr>
  <tr valign="top" style="height:71pt">
  <td style="pointer-events: auto; ">
  <img src="data:image/jpeg;base64,${imgEscanearCodigoBarra}" style="width: 510pt" alt=""/></td>
  </tr>
  </table>
  </div>
  <div style="position: relative; width: 100%; height: 100%; pointer-events: none; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:2pt"></td>
  <td style="width:100pt"></td>
  <td style="width:170pt"></td>
  <td style="width:130pt"></td>
  <td style="width:100pt"></td>
  <td style="width:8pt"></td>
  </tr>
  <tr valign="top" style="height:30pt">
  <td>
  </td>
  <td style="pointer-events: auto; text-indent: 0px; text-align: left;">
  <span style="font-family: Segoe UI Semibold; color: #000000; font-size: 13pt; line-height: 1.3300781; font-weight: bold;">TOTAL</span></td>
  <td colspan="2">
  </td>
  <td style="pointer-events: auto; text-indent: 0px; text-align: right;">
  <span style="font-family: Segoe UI Semibold; color: #000000; font-size: 14pt; line-height: 1.3300781; font-weight: bold;">${totalPrice}</span></td>
  <td>
  </td>
  </tr>
  <tr valign="top" style="height:5pt">
  <td colspan="6">
  </td>
  </tr>
  <tr valign="top" style="height:38pt">
  <td colspan="3">
  </td>
  <td colspan="2" style="pointer-events: auto; ">
  <img src="data:image/jpeg;base64,${imgCodigoBarra}" style="height: 38pt" alt=""/></td>
  <td>
  </td>
  </tr>
  <tr valign="top" style="height:18pt">
  <td colspan="6">
  </td>
  </tr>
  </table>
  </div>
  </div>
  </td>
  <td>
  </td>
  </tr>
  <tr valign="top" style="height:47pt">
  <td colspan="4">
  </td>
  </tr>
  <tr valign="top" style="height:117pt">
  <td>
  </td>
  <td>
  <div style="width: 100%; height: 100%; position: relative;">
  <div style="position: absolute; overflow: hidden; width: 100%; height: 100%; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:126pt"></td>
  </tr>
  <tr valign="top" style="height:117pt">
  <td style="pointer-events: auto; ">
  <img src="data:image/jpeg;base64,${imgQRBox}" style="height: 117pt" alt=""/></td>
  </tr>
  </table>
  </div>
  <div style="position: relative; width: 100%; height: 100%; pointer-events: none; ">
  <table cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 100%;">
  <tr valign="top" style="height:0">
  <td style="width:34pt"></td>
  <td style="width:58pt"></td>
  <td style="width:34pt"></td>
  </tr>
  <tr valign="top" style="height:49pt">
  <td colspan="3">
  </td>
  </tr>
  <tr valign="top" style="height:58pt">
  <td>
  </td>
  <td style="pointer-events: auto; ">
  <img src="data:image/jpeg;base64,${imgQRProhibidos}" style="height: 58pt" alt=""/></td>
  <td>
  </td>
  </tr>
  <tr valign="top" style="height:10pt">
  <td colspan="3">
  </td>
  </tr>
  </table>
  </div>
  </div>
  </td>
  <td colspan="2">
  </td>
  </tr>
  <tr valign="top" style="height:35pt">
  <td colspan="4">
  </td>
  </tr>
  </table>
  </div>
  </div>
  </td>
  <td colspan="3">
  </td>
  </tr>
  <tr valign="top" style="height:10pt">
  <td colspan="6">
  </td>
  <td rowspan="4">
  <img src="data:image/png;base64,${imgQRTrackeo}" style="height: 75pt" alt=""/></td>
  <td colspan="3">
  </td>
  <td rowspan="4">
  <img src="data:image/png;base64,${imgQRConsultas}" style="height: 75pt" alt=""/></td>
  <td colspan="5">
  </td>
  </tr>
  <tr valign="top" style="height:34pt">
  <td colspan="6">
  </td>
  <td colspan="2" style="text-indent: 0px; text-align: left;">
  <span style="font-family: 'DejaVu Sans', Arial, Helvetica, sans-serif; color: #000000; font-size: 10pt; line-height: 1.2578125;">Para rastrear tu envío, escanea este código QR o ingresa a <br/></span></td>
  <td>
  </td>
  <td rowspan="2" style="text-indent: 0px; text-align: left;">
  <span style="font-family: 'DejaVu Sans', Arial, Helvetica, sans-serif; color: #000000; font-size: 10pt; line-height: 1.2578125;">Si necesitas ayuda, escanea este código QR y envíanos tu consulta.</span></td>
  <td colspan="4">
  </td>
  </tr>
  <tr valign="top" style="height:10pt">
  <td colspan="6">
  </td>
  <td colspan="3">
  </td>
  <td colspan="4">
  </td>
  </tr>
  <tr valign="top" style="height:21pt">
  <td colspan="6">
  </td>
  <td colspan="3">
  </td>
  <td colspan="5">
  </td>
  </tr>
  <tr valign="top" style="height:5pt">
  <td colspan="16">
  </td>
  </tr>
  <tr valign="top" style="height:160pt">
  <td colspan="5">
  </td>
  <td colspan="9">
  <img src="data:image/jpeg;base64,${imgFinal}" style="height: 160pt" alt=""/></td>
  <td colspan="2">
  </td>
  </tr>
  <tr valign="top" style="height:20pt">
  <td colspan="16">
  </td>
  </tr>
  </table>
  
  </td><td width="50%">&nbsp;</td></tr>
  </table>
`;

  return ( header +  body );
}

//Funcion que convierte el formato de fecha dd/mm/yyyy a dd mmm yyyy
function dateConverter(d) {
  //Array con meses en formato Mmm
  const monthList = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];
  //Se realiza un split de la cadena con la fecha en formato DD/MM/YYYY
  const arrayDate = d.split("/");

  //Se hace la asignacion de los dias, meses y variables obtenidos en el split del paso anterior 
  const day = arrayDate[0];
  const mnt = monthList[arrayDate[1]-1];
  const yr = arrayDate[2];

  return  day + ' ' + mnt + ' ' + yr;
}
