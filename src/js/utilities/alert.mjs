export function showAlert(type, message) {
  const alertContainer = document.getElementById('alert-container');
  if (!alertContainer) return;

  const alertDiv = document.createElement('div');
  alertDiv.className = `flex items-center p-4 mb-4 text-sm rounded-lg ${
    type === 'success' ? 'text-black bg-[#BAEEE2]' : 'text-red-700 bg-red-100'
  }`;
  alertDiv.innerHTML = `
    <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${
        type === 'success'
          ? 'M5 13l4 4L19 7'
          : 'M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0z'
      }" />
    </svg>
    <span>${message}</span>
  `;

  alertContainer.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}
