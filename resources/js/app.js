import './bootstrap';

window.onMemberEdit = (event)=>{
    var member = {
        email:"",
        name:"",
        alamat:"",
        no_telp:"",
        no_anggota:"",
        no_ktp:"",
        jabatan_id:"",
        id:"",
    };

    if(event)
        member = JSON.parse(event.dataset.member);
    var email = document.getElementById('memberEmail');
    var name = document.getElementById('memberName');
    var alamat = document.getElementById('memberAlamat');
    var no_telp = document.getElementById('memberNoTelp');
    var no_anggota = document.getElementById('memberNoAnggota');
    var no_ktp = document.getElementById('memberNoKtp');
    var jabatan_id = document.getElementById('memberJabatan');
    var id = document.getElementById('memberId');
    var foto = document.getElementById('memberFoto');

    email.value = member.email;
    name.value = member.name;
    alamat.value = member.alamat;
    no_telp.value = member.no_telp;
    no_anggota.value = member.no_anggota;
    no_ktp.value = member.no_ktp;
    jabatan_id.value = member.jabatan_id;
    id.value = member.id;
    foto.value = "";

    if (member.foto) {
        var fotoPlace = document.getElementById('fotoPlaceholder');
        fotoPlace.innerHTML = `<img src="/admin/member/${member.foto}" style="max-width: 100%;" />`
    } else{
        var fotoPlace = document.getElementById('fotoPlaceholder');
        fotoPlace.innerHTML = `<div class="btn input-photo d-flex justify-content-center align-items-center btn-outline-dark">Pilih Foto</div>`
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

window.onConfirmDelete=(event)=>{
  var deleteId = event.dataset.deleteid;

  var id = document.getElementById('deleteId');
  id.value = deleteId;
}

window.onMessageShow=(event)=>{
  if(event){
      var notif = JSON.parse(event.dataset.notif);
     
      var title = document.getElementById('notifTitle');
      var message = document.getElementById('notifMessage');
      var notifRead = document.querySelectorAll('.notif-read');

      title.innerHTML = notif.data.title;
      message.innerHTML = notif.data.message;
      for(let i=0; i<notifRead.length; i++)
      {
        notifRead[i].setAttribute('href', '/notification/read/' + notif.id);
      }
      
  }
}

window.onMessageRead=(event)=>{
  if(event){
      var notif = JSON.parse(event.dataset.notif);

      var title = document.getElementById('readNotifTitle');
      var message = document.getElementById('readNotifMessage');

      title.innerHTML = notif.data.title;
      message.innerHTML = notif.data.message;
      
  }
}

window.onSliderEdit = (event)=>{
  var slider = {
      foto:"",
      url:"",
      id:"",
  };

  var foto = document.getElementById('sliderFoto');
  var url = document.getElementById('sliderUrl');
  var status = document.getElementById('sliderStatus');
  var id = document.getElementById('sliderId');

  if(event){
    slider = JSON.parse(event.dataset.slider);
    foto.removeAttribute("required");
} else{
    foto.setAttribute("required", "true");
}

  foto.value = "";
  url.value = slider.url;
  status.value = slider.status;
  id.value = slider.id;

  if (slider.foto) {
    var fotoPlace = document.getElementById('fotoPlaceholder');
    fotoPlace.innerHTML = `<img src="/storage/${slider.foto}" style="max-width: 100%;" />`
} else{
  var fotoPlace = document.getElementById('fotoPlaceholder');
  fotoPlace.innerHTML = `<div class="btn input-photo d-flex justify-content-center align-items-center btn-outline-dark">Pilih Foto</div>`
}
}