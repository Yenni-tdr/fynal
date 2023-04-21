import React from "react";
import DeliveryMap from "../fonctions/DeliveryMap";

const Delivery = () => {
  const addresses = [
    "15 rue de la paix, Paris, 75002",
    "25 avenue des Champs-Élysées, Paris, 75008",
    "10 rue de Rivoli, Paris, 75004",
    "5 Boulevard de Picpus, Paris, 75012",
  ];

  return( 
    <div className="-z-50">
        <DeliveryMap addresses={addresses} />
    </div>
  )
};

export default Delivery;
