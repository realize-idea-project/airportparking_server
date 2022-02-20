/* eslint-disable no-undef */

console.log('js file connected');

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

  const formData = getFilesAppendedFormData(files, uploadKey.textContent);
  const csvFile = await sendFormData(formData, uploadDate);
  
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
  const url = uploadUrl.textContent;
  const query = `?date=${date}`;
  const method = 'POST';

  const final = `${url}${query}`;
  console.log('final', final)
  
  const res = await fetch(final, { method, body });
  const blob = await res.blob();
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