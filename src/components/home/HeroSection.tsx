import React from 'react';

export const HeroSection = () => {
  return (
    <div className="text-left space-y-6 mb-12 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold text-yellow-300 max-w-2xl">
        Organiser sa pratique devient plus simple
      </h1>
      <p className="text-lg text-white max-w-3xl">
        Accessible à tous, licenciés ou non, joueurs loisirs et compétiteurs, nous vous proposons de nombreux services pour faciliter votre pratique :
      </p>
      <ul className="space-y-3 text-white list-none">
        {[
          "trouver un club et souscrire à ses offres",
          "réserver un terrain dans votre club ou louer un court dans un autre club",
          "suivre vos performances et votre classement tout au long de l'année",
          "s'inscrire à des tournois partout en France",
          "retrouver tous les avantages des licenciés"
        ].map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-yellow-300" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};