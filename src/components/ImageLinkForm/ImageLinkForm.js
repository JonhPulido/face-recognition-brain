import React from 'react';
import './ImageLinkForm.css';
const   style = {
	display : 'none'
}

const ImageLinkForm = ({ onInputChange, onButtonSubmit, onChange }) => {
return (
	<div>
		<p className='f3'>
		{'This Magic Brain will detect faces in your pictures. Git it a try.'}
		</p>
		<div className='center'>
			<div className='form center pa4 br3 shadow-5'>
				<input className='f4 pa2 w-70 center' type='tex' onChange={onInputChange}/>
				<button
					className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
					onClick={onButtonSubmit}
				>Detect</button>
				<div>
					<label 
						className='ma1 grow f4 link ph3 pv2 dib white bg-light-blue'
						htmlFor='single'
					>Browse
					</label>
					<input type='file' id='single' style={style} onChange={onChange}/>
				</div>
			</div>
		</div>
	</div>
);
}

export default ImageLinkForm;