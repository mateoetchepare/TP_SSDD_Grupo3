
export default () => {
    const view = `
    <h2>404</h2>
    `;

  const divElement = document.createElement("div");
  divElement.innerHTML = view;
  return divElement;
};