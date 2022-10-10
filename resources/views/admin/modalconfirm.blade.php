<form action="{{ $deleteUrl }}" method="post">
        @csrf
        <input id="deleteId" name="id" type="hidden" value=""/>
    <div id="deleteModal" class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title text-danger text-decoration-none d-flex flex-row"><i class="material-icons d-block">warning</i>Konfirmasi</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Yakin untuk menghapus?</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-danger">Hapus</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
      </div>
    </div>
  </div>
</div>
    </form>