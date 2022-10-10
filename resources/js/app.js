import './bootstrap';

window.onMemberEdit = (event)=>{
    var member = {
        email:"",
        name:"",
        no_anggota:"",
        no_ktp:"",
        jabatan_id:"",
        id:"",
    };

    if(event)
        member = JSON.parse(event.dataset.member);
    var email = document.getElementById('memberEmail');
    var name = document.getElementById('memberName');
    var no_anggota = document.getElementById('memberNoAnggota');
    var no_ktp = document.getElementById('memberNoKtp');
    var jabatan_id = document.getElementById('memberJabatan');
    var id = document.getElementById('memberId');
    var foto = document.getElementById('memberFoto');

    email.value = member.email;
    name.value = member.name;
    no_anggota.value = member.no_anggota;
    no_ktp.value = member.no_ktp;
    jabatan_id.value = member.jabatan_id;
    id.value = member.id;
    foto.value = "";

    if (member.foto) {
        var fotoPlace = document.getElementById('fotoPlaceholder');
        fotoPlace.innerHTML = `<img src="/admin/member/${member.foto}" style="max-width: 100%;" />`
    }
}

window.onJabatanEdit = (event)=>{
    var jabatan = {
        name:"",
        id:"",
    };

    if(event)
        jabatan = JSON.parse(event.dataset.jabatan);
    var name = document.getElementById('jabatanName');
    var id = document.getElementById('jabatanId');

    name.value = jabatan.name;
    id.value = jabatan.id;
}

var newsKontenEditor;
window.onNewsEdit = (event)=>{
    var news = {
        judul:"",
        konten:"",
        id:"",
    };

    if(event)
        news = JSON.parse(event.dataset.news);
    var judul = document.getElementById('newsJudul');
    var konten = document.getElementById('newsKonten');
    var id = document.getElementById('newsId');

    judul.value = news.judul;
    konten.value = news.konten;
    newsKontenEditor.data.set(news.konten);
    id.value = news.id;
}

ClassicEditor
.create( document.querySelector( '.editor' ) )
.then(editor =>{
    var konten = document.getElementById(editor.sourceElement.dataset.id);
    if (editor.sourceElement.dataset.id == 'newsKonten') {
        newsKontenEditor = editor
    }
    editor.model.document.on( 'change:data', () => {
        var editorData = editor.getData();
        konten.value = editorData
    })
})
.catch( error => {
    console.error( error );
} );


window.selectFile = (id) => {
  if (id) {
    var input = document.getElementById(id);
    input.click();
  }
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.onerror = function (error) {
      reject(error);
    };
  })
}

window.onSelectFileChanged = (event, id) => {
  if (event.files.length > 0) {
    getBase64(event.files[0]).then(img => {
      var placeholder = document.getElementById(id);
      placeholder.innerHTML = `<img src="${img}" style="max-width: 100%;" />`
    }, err => {
      console.error(err)
    });
  } else {
    var placeholder = document.getElementById(id);
    placeholder.innerHTML = `
      <div class="btn input-photo d-flex justify-content-center align-items-center btn-outline-dark">
        Pilih Foto
      </div>
    `;
  }
}
