import React from "react";
import Image from '../Image/Image';
import './Gallery.css';


class Gallery extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      loading: true,
      uploading: false,
      images: props.imageArray
    }
  }

 
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
