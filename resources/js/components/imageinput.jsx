import React from 'react';

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

export default (props) => {
  const inputRef = React.useRef();
  const [url, setUrl] = React.useState('');

  React.useEffect(() => {
    if (props.value) {
      setUrl(props.value)
    } else {
      setUrl('')
    }
  }, [props.value]);

  if (!props.id || !props.name) return null;

  const elementId = 'file-input-' + props.id

  const onChange = async (event) => {
    if (inputRef.current) {
      if (inputRef.current.files.length > 0) {
        if (props.onChange) props.onChange(inputRef.current.files[0])
        try {
          const img = await getBase64(inputRef.current.files[0])
          setUrl(img)
        } catch (err) {
          console.error(err)
        }
      } else {
        setUrl('');
      }
    }
  }

  const selectImage = () => {
    if (inputRef.current) inputRef.current.click();
  }

  return (
    <div className="mb-3">
      <label htmlFor={elementId} className="form-label">{props.label}: </label>
      <div id={props.id} onClick={selectImage}>
        { url && (
          <div className="d-flex justify-content-center align-items-center"><img src={url} style={{maxWidth: '100%'}} /></div>
        )}
        { !url && (
          <div className="btn input-photo d-flex justify-content-center align-items-center btn-outline-dark">
            {props.placeholder ? props.placeholder : 'Pilih Gambar'}
          </div>
        )}
      </div>
      <input ref={inputRef} id={elementId} className="form-control d-none" name={props.name} type="file" accept="image/png, image/jpeg" onChange={onChange} />
    </div>
  )
}
