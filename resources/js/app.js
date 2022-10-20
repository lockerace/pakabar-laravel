import './bootstrap';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const csrfToken = document.querySelector('meta[name="csrf-token"]')

class MyUploadAdapter {
    constructor( loader ) {
        // CKEditor 5's FileLoader instance.
        this.loader = loader;

        // URL where to send files.
        this.url = '/admin/news/image-upload';
        this.token = localStorage.getItem("token");
    }

    // Starts the upload process.
    upload() {
        return new Promise( ( resolve, reject ) => {
            this._initRequest();
            this._initListeners( resolve, reject );
            this._sendRequest();
        } );
    }

    // Aborts the upload process.
    abort() {
        if ( this.xhr ) {
            this.xhr.abort();
        }
    }

    // Example implementation using XMLHttpRequest.
    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();

        xhr.open( 'POST', this.url, true );
        xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken.content);
        xhr.setRequestHeader("Authorization", 'Bearer ' + this.token);
        xhr.responseType = 'json';
    }

    // Initializes XMLHttpRequest listeners.
    _initListeners( resolve, reject ) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = 'Couldn\'t upload file:' + ` ${ loader.file.name }.`;

        xhr.addEventListener( 'error', () => reject( genericErrorText ) );
        xhr.addEventListener( 'abort', () => reject() );
        xhr.addEventListener( 'load', () => {
            const response = xhr.response;

            if ( !response || response.error ) {
                return reject( response && response.error ? response.error.message : genericErrorText );
            }

            // If the upload is successful, resolve the upload promise with an object containing
            // at least the "default" URL, pointing to the image on the server.
            resolve( {
                default: response.url
            } );
        } );

        if ( xhr.upload ) {
            xhr.upload.addEventListener( 'progress', evt => {
                if ( evt.lengthComputable ) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            } );
        }
    }

    // Prepares the data and sends the request.
    async _sendRequest() {
        const data = new FormData();

        data.append( 'upload', await this.loader.file );

        this.xhr.send( data );
    }
}

function MyCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        return new MyUploadAdapter( loader );
    };
}

window.onMemberEdit = (event)=>{
    var member = {
        email:"",
        name:"",
        alamat:"",
        no_telp:"",
        no_anggota:"",
        no_ktp:"",
        jabatan_id:"",
        status:"",
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
    var status = document.getElementById('memberStatus');
    var id = document.getElementById('memberId');
    var foto = document.getElementById('memberFoto');

    email.value = member.email;
    name.value = member.name;
    alamat.value = member.alamat;
    no_telp.value = member.no_telp;
    no_anggota.value = member.no_anggota;
    no_ktp.value = member.no_ktp;
    jabatan_id.value = member.jabatan_id;
    status.value = member.status;
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

if (document.querySelector( '.editor' )) {
    ClassicEditor
        .create( document.querySelector( '.editor' ), {
            extraPlugins: [ MyCustomUploadAdapterPlugin ],
        })
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
}


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

window.onBankEdit = (event)=>{
  var bank = {
      no_rekening:"",
      nama_bank:"",
      name:"",
      saldo:"",
      id:"",
  };

  if(event)
      bank = JSON.parse(event.dataset.bank);
  var no_rekening = document.getElementById('bankNumber');
  var nama_bank = document.getElementById('bankName');
  var name = document.getElementById('userName');
  var saldo = document.getElementById('bankSaldo');
  var id = document.getElementById('bankId');

  no_rekening.value = bank.no_rekening;
  nama_bank.value = bank.nama_bank;
  name.value = bank.name;
  saldo.value = bank.saldo;
  id.value = bank.id;
}

window.onTransactionEdit = (event)=>{
  var transaction = {
      bank_id:"",
      receiver_bank_id:"",
      note:"",
      isIn:"",
      amount:"",
      author:"",
      balance:"",
      nextId:"",
  };

  if(event)
      transaction = JSON.parse(event.dataset.transaction);
  var bank_id = document.getElementById('bankTypeId');
  var receiver_bank_id = document.getElementById('bankReceiverId');
  var note = document.getElementById('bankNote');
  var isIn = document.getElementById('isIn');
  var amount = document.getElementById('bankAmount');
  var id = document.getElementById('transactionId');

  bank_id.value = transaction.bank_id;
  receiver_bank_id.value = transaction.receiver_bank_id;
  note.value = transaction.note;
  isIn.value = transaction.isIn;
  amount.value = transaction.amount;
  id.value = transaction.id;
}

window.onNotifikasiEdit = (event)=>{
  var notifikasi = {
      title:"",
      message:"",
  };

  if(event)
      notifikasi = JSON.parse(event.dataset.notifikasi);
  var title = document.getElementById('notifTitle');
  var message = document.getElementById('notifMessage');

  title.value = notifikasi.title;
  message.value = notifikasi.message;
}

window.onBankLedgerStatusChanged = (event)=>{
  var bank_receiver = document.getElementById('bankReceiver');
  if(event.value == 2){
    bank_receiver.classList.add("d-block");
    bank_receiver.classList.remove("d-none");
  } else{
    bank_receiver.classList.add("d-none");
    bank_receiver.classList.remove("d-block");
  }
}
