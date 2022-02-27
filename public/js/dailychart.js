/* eslint-disable no-undef */

console.log('js file connected');
console.log('js file connected2');

const uploadUrl = document.querySelector('#form__url__secret');
const uploadKey = document.querySelector('#form__input__key__secret');
const form = document.querySelector('#form__excel');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const downloader = new DownloadAnchorTag();

  const files = getFilesFromEvent(event);
  const uploadDate = event.target.date.value;
  
  if (!uploadDate) {
    alert('업로드 날짜를 선택해주세요');
    return;
  }
  
  if (files.length === 0) {
    alert('파일을 먼저 추가해주세요.');
    return;
  }

  console.log('1')
  const formData = getFilesAppendedFormData(files, uploadKey.textContent);
  console.log('2')
  const csvFile = await sendFormData(formData, uploadDate);
  console.log('3')
  
  if (!csvFile) return;

  downloader
    .appendDownloadResource(csvFile)
    .download()
    .endProcess();
});

const getFilesFromEvent = (event) => {
  return [...event.target]
  .map((input) => input.files?.[0])
  .filter((file) => file);
};

const getFilesAppendedFormData = (files, formDataKey) => {
  const formData = new FormData();
  files.forEach((file) => formData.append(formDataKey, file));
  return formData;
};

const sendFormData = async (body, date) => {
  console.log('2-1')
  const url = uploadUrl.textContent;
  const query = `?date=${date}`;
  const apiUrl = `${url}${query}`;
  const method = 'POST';

  console.log('2-2', url);
  if (apiUrl.includes('undefined')) {
    console.log(`api url: ${apiUrl}`);
    alert('잘못된 api 요청 주소 입니다. 개발자에게 문의 바랍니다.');
    return;
  }

  console.log('2-3', body);
  const res = await fetch(apiUrl, { method, body });
  const blob = await res.blob();

  if (blob.type.includes('json')) {
    alert('파일 생성에 실패하였습니다.');
    return;
  }
  
  return blob;
};
class DownloadAnchorTag {
  anchor;

  constructor() {
    this.anchor = document.createElement('a');
    document.body.appendChild(this.anchor);
  }

  appendDownloadResource = (blob, filename) => {
    this.anchor.href = window.URL.createObjectURL(blob);
    this.anchor.download = filename || `${Date.now()}.csv`;
    return this;
  };

  download = () => {
    this.anchor.click();
    this.anchor.remove();
    return this;
  };

  endProcess = () => {
    location.reload();
    alert('파일 생성이 완료되었습니다.');
  };
}