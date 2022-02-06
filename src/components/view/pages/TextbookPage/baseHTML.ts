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
        <div id="btn-first" class="btn">&laquo;</div>
        <div id="btn-prev" class="btn">&lt;</div>
        <div id="page-text" class="page-text">Page&nbsp;<span>1</span></div>
        <div id="btn-next" class="btn">&gt;</div>
        <div id="btn-last" class="btn">&raquo;</div>
      </div>
    </div>

    <div class="cards"></div>

    <div class="loading"></div>
  </section>
`;

export default content;
