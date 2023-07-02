import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as faSolid from "@fortawesome/free-solid-svg-icons";
import * as faRegular from "@fortawesome/free-regular-svg-icons";
import * as faBrands from "@fortawesome/free-brands-svg-icons";
import * as Style from "./Product_Item_Styled"
import ConvertToImage from "../../../AssistsFunc/ConvertBlobToImage";

function Product_Item({item}) {

    const toCapitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      };

    const AddToCart = () => {
        fetch(`/product-detail/${item.id}/addtocart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userid: JSON.parse(localStorage.getItem("auth")).id, 
                quantity: 1
            }),
        })
        .then(res => res.json())
        .then(data=> {
            console.log(data);
        })
        
    }
    return (
    
            <Style.Product_Item_Wrap key = {item.id}>
                <Style.Product_content>
                    <Style.Pic_item_wrap>
                        <a href={`/shop/product/${item.id}`}>
                            <img src={ConvertToImage(item.image)} alt={item.PdName}></img>
                        </a>

                        <Style.Product_side_btn>
                            <Style.Side_btn_wishlist>
                                <button>
                                    <FontAwesomeIcon icon={faRegular.faHeart} />
                                </button>
                            </Style.Side_btn_wishlist>

                            {/* Cứ để full side bar nhìn nó đỡ cụt*/}
                            <Style.Side_btn_quickView>
                                <button>
                                    <FontAwesomeIcon icon={faRegular.faEye} />
                                </button>
                            </Style.Side_btn_quickView>

                            <Style.Side_btn_compare>
                                <button>
                                    <FontAwesomeIcon icon={faSolid.faArrowRightArrowLeft} />
                                </button>
                            </Style.Side_btn_compare>

                            <Style.Side_btn_addToCart>
                                <button onClick={AddToCart}>
                                    <FontAwesomeIcon icon={faSolid.faCartShopping} />
                                </button>
                            </Style.Side_btn_addToCart>
                        </Style.Product_side_btn>

                    </Style.Pic_item_wrap>

                    <Style.Pic_item_des>
                        <Style.Star_rating>
                            {
                                new Array(5).fill('').map((_, idx) => (
                                    idx +1 <= item.AvgRating
                                    ? <FontAwesomeIcon icon={faSolid.faStar}/>
                                    : item.AvgRating - parseInt(item.AvgRating) >= 0.5 
                                        ? <FontAwesomeIcon icon={faRegular.faStarHalfAlt}/>
                                        : <FontAwesomeIcon icon={faRegular.faStar}/>
                                ))
                            }
                        </Style.Star_rating>

                        <h3>{item.PdName}</h3>

                        <Style.Product_price>
                            <span>
                                <FontAwesomeIcon icon={faSolid.faDollarSign} />
                                <p>{(item.price).toFixed(2)} / {toCapitalize(item.unit)}</p>
                            </span>
                        </Style.Product_price>
                    </Style.Pic_item_des>
                </Style.Product_content>
            </Style.Product_Item_Wrap>   

    )
}

export default Product_Item