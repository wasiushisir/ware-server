import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Item.css';

const Item = ({item}) => {
    const navigate=useNavigate();
   
    const {name,img,price,Quantity,_id}=item
    const handleStockUpdate=(id)=>
    {
        navigate(`/inventory/${id}`)


    } 

    

    
    return (
        <div class="card col-12 col-lg-4 ms-5 mt-4  rounded-top-left  rounded-bottom-right img-container" style={{ width: '20rem',background:"#F8F8FF" }}>
        <img  style={{ width: '12rem' }} src={img} class="card-img-top" alt="..." />
        <div class="card-body">
            <h5>Name: {name}</h5>
            <h5>Quantity: {Quantity}</h5>
            <h5>Price: {price}</h5>
          <button className='btn btn-primary' onClick={()=>handleStockUpdate(_id)}> Stock Update</button> 

        </div>
    </div>
       
            
  
  
        
        
      
    );
};

export default Item;