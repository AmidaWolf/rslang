const content = `
  <section class="container textbook">
    <div class="container-manage">

      <select name="group-words" id="group-words">
        <option selected value="Группа 1">Группа 1</option>
        <option value="Группа 2">Группа 2</option>
        <option value="Группа 3">Группа 3</option>
        <option value="Группа 4">Группа 4</option>
        <option value="Группа 5">Группа 5</option>
        <option value="Группа 6">Группа 6</option>
      </select>

      <div class="textbook__pages">
        <button id="btn-first" class="btn disabled">&laquo;</button>
        <button id="btn-prev" class="btn disabled">&lt;</button>
        <p id="page-text" class="page-text">Page&nbsp;<span>1</span></p>
        <button id="btn-next" class="btn">&gt;</button>
        <button id="btn-last" class="btn">&raquo;</button>
      </div>
    </div>

    <ul class="cards"></ul>

    <div class="loading"></div>
  </section>
`;

export default content;
