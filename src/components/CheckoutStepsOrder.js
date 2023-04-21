import React from "react";

export default function CheckoutStepsOrder({ activeStep = 0 }) {
  return (
    <div className="mb-5 flex flex-wrap">
      {["Connexion", "Adresse de livraison", "Moyen de paiement", "Achat"].map(
        (step, index) => (
          <div
            key={step}
            className={`flex-1 border-b-2 text-center ${
              index <= activeStep
                ? "border-indigo-500 text-indigo-500 font-semibold"
                : "border-gray-400 text-gray-400 "
            }`}
          >
            {step}
          </div>
        )
      )}
    </div>
  );
}
