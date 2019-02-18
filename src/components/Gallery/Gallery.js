import React from "react";
import Image from '../Image/Image';
import './Gallery.css';
import { API_URL } from '../config';


class Gallery extends React.Component {

constructor(props){
super(props);
	this.state = {
		loading: true,
		uploading: false,
		images: []
	}
} 



popo = fetch(`${API_URL}/images`,{
	method: 'get',
	headers: {'Content-Type': 'application/json'}
})
.then(response => response.json())
.then(urls =>  this.setState({images:urls}))





render() { 
const {images} = this.state; 
return (      
<div className="gallery m5">
{images.map((imageObj, i)=> 
<div key={i}>
<Image imageObj={imageObj}/>
</div>
)} 
</div>
);
}
}
export default Gallery;
