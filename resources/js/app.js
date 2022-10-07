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

    email.value = member.email;
    name.value = member.name;
    no_anggota.value = member.no_anggota;
    no_ktp.value = member.no_ktp;
    jabatan_id.value = member.jabatan_id;
    id.value = member.id;
}