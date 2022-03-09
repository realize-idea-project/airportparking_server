/* eslint-disable no-undef */

console.log('js file connected');

const uploadUrl = document.querySelector('#form__url__secret');
const uploadKey = document.querySelector('#form__input__key__secret');
const form = document.querySelector('#form__excel');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

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
  const result = await sendFormData(formData, uploadDate);

  const message = result.response ? '업로드에 성공하였습니다.' : '업로드에 실패하였습니다.';
  alert(message);
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
  const apiUrl = `${url}${query}`;
  const method = 'POST';

  if (apiUrl.includes('undefined')) {
    console.log(`api url: ${apiUrl}`);
    alert('잘못된 api 요청 주소 입니다. 개발자에게 문의 바랍니다.');
    return;
  }

  const res = await fetch(apiUrl, { method, body });
  const result = await res.json();

  return result;
};
