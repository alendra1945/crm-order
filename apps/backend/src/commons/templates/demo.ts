// import * as path from 'node:path';
// import { Template } from 'nunjucks';
// import pLimit, { LimitFunction } from 'p-limit';
// let limit: LimitFunction | null = null;
// if (!limit) {
//   limit = pLimit(5);
// }

// const templates = path.join(__dirname, `../templates`);

// function convertCss(stylesheet: Record<string, any>) {
//   return Array.from(Object.keys(stylesheet))
//     .map((rule) => `${rule}:${stylesheet[rule]}`)
//     .join(';');
// }
// function toItems(attributeRecord: Record<string, any>) {
//   const arrayAttr: [string, any][] = [];
//   if (Object.keys(attributeRecord || {}).length) {
//     Object.keys(attributeRecord).forEach((activeKey) => {
//       arrayAttr.push([activeKey, attributeRecord[activeKey]]);
//     });
//   }
//   return arrayAttr;
// }
// function mergeRecord(obj1: Record<string, any>, obj2: Record<string, any>) {
//   return {
//     ...(obj1 || {}),
//     ...(obj2 || {}),
//   };
// }

// function updateAttributes(
//   data_key: Record<string, any>,
//   data: Record<string, any>,
//   prev_attributes: Record<string, any>
// ) {
//   const attr = prev_attributes || {};
//   if (data_key && data) {
//     if (data_key['type'] == 'attribute') {
//       attr[data_key['property']] = getDataForKey(data, data_key['key']) || attr[data_key['property']];
//     }
//   }

//   return attr;
// }
// function getDataForKey(datum: object, key: string) {
//   const data = Object.assign({}, datum);
//   return key.split('.').reduce((d: any, key) => (d ? d[key] : null), data) as any;
// }
// function getElementData(data_key: Record<string, any>, data: Record<string, any>) {
//   let element_data: any[] = [];
//   if (data_key && data) {
//     element_data = getDataForKey(data, data_key['key']) || element_data;
//     element_data = element_data.map((v, i) => ({ ...v, idx: i + 1 }));
//   }
//   return element_data;
// }

// function renderTemplate(templateStr: string, context: Record<string, any>) {
//   const regex =
//     /<span\s+data-source="([^"]+)"\s+label="([^"]+)"\s+color="([^"]+)"\s+data-type="variable-component-node">(.*?)<\/span>/;
//   const newtemplate = templateStr.replace(regex, '$4');

//   const template = new Template(newtemplate);
//   return template.render({
//     data: context,
//   });
// }

// const validJson = await c.req.json();
// const pdfFormatElements = JSON.parse(validJson.pdfFormatElements) || {};
// console.log(pdfFormatElements);

// const env = new Environment(new FileSystemLoader(templates), {
//   autoescape: true,
// });
// env.addGlobal('convert_css', convertCss);
// env.addGlobal('to_items', toItems);
// env.addGlobal('merge_dict', mergeRecord);
// env.addGlobal('enumerate', (data: any[]) => data.map((v, i) => [i, v]));
// env.addGlobal('update_attributes', updateAttributes);
// env.addGlobal('get_element_data', getElementData);
// env.addFilter('render_template', renderTemplate);
// const printformat = env.getTemplate('print_format.html');
// const css = await fs.promises.readFile(templates + '/reporting-template-style.css', 'utf8');

// const settings = pdfFormatElements['pageSettings'] || {};
// const renderPrintFormat = printformat.render({
//   pdf_format_elements: pdfFormatElements['elementsData'] || [],
//   settings: pdfFormatElements['pageSettings'] || {},
//   global_data: pdfFormatElements['globalData'] || {},
//   page_data: pdfFormatElements['pageData'] || {},
//   display_css: css,
// });

// const renderElementPrintFormat = renderPrintFormat.split('[stzee_separate_document_pdf]');
// const headerElement = renderElementPrintFormat[0];
// const bodyElement = renderElementPrintFormat[1];
// const watermarkElement = renderElementPrintFormat[2];
// const footerElement = renderElementPrintFormat[3];
// const mergeRenderElement = `${bodyElement}${headerElement}${footerElement}${watermarkElement}</div></body></html>`;
// // fs.writeFileSync("./debug.html", mergeRenderElement);
// console.log('mergeRenderElement');
// const data = await (async () => {
//   const browser = await getBrowserInstance()!;
//   const context = await browser.newContext();
//   const page = await context.newPage();
//   await page.setContent(mergeRenderElement, {
//     waitUntil: 'networkidle',
//   });
//   console.log('ruuuuuuuuu');
//   await page.emulateMedia();
//   const res = await page.pdf({
//     width: `${settings['width']}px`,
//     height: `${settings['height']}px`,
//     displayHeaderFooter: false,
//     printBackground: true,
//     headerTemplate: '',
//     footerTemplate: '',
//     margin: {
//       top: `${settings['marginTop']}px`,
//       bottom: `${settings['marginBottom']}px`,
//       left: `${settings['marginLeft']}px`,
//       right: `${settings['marginRight']}px`,
//     },
//   });
//   await context.close();
//   await page.close();
//   scheduleBrowserClose();
//   return res;
// })();

// return c.json(
//   {
//     data: data.toString('base64'),
//   },
//   200
// );
