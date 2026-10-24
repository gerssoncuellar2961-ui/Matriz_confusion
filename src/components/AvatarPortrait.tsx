/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Camera, Maximize2, X, Fingerprint, Shield, Scan } from 'lucide-react';

interface AvatarPortraitProps {
  code: string;
  alias: string;
  archetype: string;
  accentColor?: string;
  className?: string;
  showPlacard?: boolean;
}

export const AvatarPortrait: React.FC<AvatarPortraitProps> = ({
  code,
  alias,
  archetype,
  accentColor = '#0ea5e9',
  className = '',
  showPlacard = true,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  // Character-specific visual attributes mapped from code EXP-01 to EXP-20
  const getSuspectProfile = (suspectCode: string) => {
    switch (suspectCode) {
      case 'EXP-01': // Marcos 'El Cerrajero' Silva
        return {
          name: "Marcos 'El Cerrajero' Silva",
          height: '1.82 m',
          age: '34 años',
          skin: '#d4a373',
          skinShadow: '#b07d58',
          hairColor: '#1c1917',
          clothing: 'Chaqueta de cuero negra y cuello térmico',
          type: 'male',
          hairStyle: 'short-fade',
          facialHair: 'stubble',
          clothingType: 'leather',
          glasses: false,
          accent: '#0ea5e9',
        };
      case 'EXP-02': // Sofía Valdivia
        return {
          name: 'Sofía Valdivia (Auditrice)',
          height: '1.68 m',
          age: '41 años',
          skin: '#faedcd',
          skinShadow: '#d4a373',
          hairColor: '#3d2618',
          clothing: 'Blazer ejecutivo azul noche con camisa blanca',
          type: 'female',
          hairStyle: 'formal-updo',
          facialHair: 'none',
          clothingType: 'suit',
          glasses: true,
          accent: '#64748b',
        };
      case 'EXP-03': // Darío 'El Búho' Montero
        return {
          name: "Darío 'El Búho' Montero",
          height: '1.77 m',
          age: '29 años',
          skin: '#e0afa0',
          skinShadow: '#c48f80',
          hairColor: '#1e293b',
          clothing: 'Gorro de lana técnico y chaleco industrial',
          type: 'male',
          hairStyle: 'beanie',
          facialHair: 'goatee',
          clothingType: 'workwear',
          glasses: false,
          accent: '#f43f5e',
        };
      case 'EXP-04': // Valeria 'Byte' Mendoza
        return {
          name: "Valeria 'Byte' Mendoza",
          height: '1.64 m',
          age: '26 años',
          skin: '#f5ebe0',
          skinShadow: '#d5bdaf',
          hairColor: '#06b6d4', // Cyan dyed
          clothing: 'Sudadera negra oversize con capucha y auriculares',
          type: 'female',
          hairStyle: 'cyber-dyed',
          facialHair: 'none',
          clothingType: 'hoodie',
          glasses: false,
          accent: '#0ea5e9',
        };
      case 'EXP-05': // Rodrigo 'El Camaleón' Soria
        return {
          name: "Rodrigo 'El Camaleón' Soria",
          height: '1.79 m',
          age: '38 años',
          skin: '#e29578',
          skinShadow: '#b86b52',
          hairColor: '#292524',
          clothing: 'Bata blanca de laboratorio y gafete institucional',
          type: 'male',
          hairStyle: 'neat-part',
          facialHair: 'clean',
          clothingType: 'labcoat',
          glasses: false,
          accent: '#f59e0b',
        };
      case 'EXP-06': // Claudia Méndez
        return {
          name: 'Claudia Méndez (Guardia)',
          height: '1.72 m',
          age: '35 años',
          skin: '#d4a373',
          skinShadow: '#aa7850',
          hairColor: '#0f172a',
          clothing: 'Uniforme de seguridad portuaria con charreteras',
          type: 'female',
          hairStyle: 'police-bun',
          facialHair: 'none',
          clothingType: 'police',
          glasses: false,
          accent: '#64748b',
        };
      case 'EXP-07': // Arturo 'Mano Rápida' Peña
        return {
          name: "Arturo 'Mano Rápida' Peña",
          height: '1.86 m',
          age: '44 años',
          skin: '#cb997e',
          skinShadow: '#a37055',
          hairColor: '#44403c',
          clothing: 'Camisa vaquera de mezclilla con cicatriz en ceja',
          type: 'male',
          hairStyle: 'rugged',
          facialHair: 'beard',
          clothingType: 'denim',
          glasses: false,
          accent: '#0ea5e9',
        };
      case 'EXP-08': // Gonzalo 'El Bibliotecario' Navarro
        return {
          name: "Gonzalo 'El Bibliotecario'",
          height: '1.74 m',
          age: '52 años',
          skin: '#fed9b7',
          skinShadow: '#ddb892',
          hairColor: '#78716c', // Canoso
          clothing: 'Chaleco de tweed sobre camisa de cuello abotonado',
          type: 'male',
          hairStyle: 'receding-grey',
          facialHair: 'mustache',
          clothingType: 'tweed',
          glasses: true,
          accent: '#64748b',
        };
      case 'EXP-09': // Beatriz 'Trixie' Leal
        return {
          name: "Beatriz 'Trixie' Leal",
          height: '1.67 m',
          age: '27 años',
          skin: '#e7c6ff',
          skinShadow: '#c8b6ff',
          hairColor: '#451a03',
          clothing: 'Gorra de reparto con visera y cortavientos rojo',
          type: 'female',
          hairStyle: 'cap-curls',
          facialHair: 'none',
          clothingType: 'courier',
          glasses: false,
          accent: '#f43f5e',
        };
      case 'EXP-10': // Ignacio 'El Relojero' Vega
        return {
          name: "Ignacio 'El Relojero' Vega",
          height: '1.80 m',
          age: '48 años',
          skin: '#ddb892',
          skinShadow: '#b08968',
          hairColor: '#262626',
          clothing: 'Camisa entallada con lupa de precisión al cuello',
          type: 'male',
          hairStyle: 'slicked-back',
          facialHair: 'trimmed-beard',
          clothingType: 'vest',
          glasses: false,
          accent: '#0ea5e9',
        };
      case 'EXP-11': // Dr. Tomás Herrera
        return {
          name: 'Dr. Tomás Herrera',
          height: '1.76 m',
          age: '56 años',
          skin: '#faedcd',
          skinShadow: '#d4a373',
          hairColor: '#94a3b8',
          clothing: 'Ambo quirúrgico verde oliva con estetoscopio',
          type: 'male',
          hairStyle: 'silver-temples',
          facialHair: 'none',
          clothingType: 'scrubs',
          glasses: true,
          accent: '#64748b',
        };
      case 'EXP-12': // Renata 'La Sombra' Casals
        return {
          name: "Renata 'La Sombra' Casals",
          height: '1.71 m',
          age: '31 años',
          skin: '#edc4b3',
          skinShadow: '#deab90',
          hairColor: '#09090b',
          clothing: 'Suéter táctico negro de cuello vuelto de infiltración',
          type: 'female',
          hairStyle: 'high-ponytail',
          facialHair: 'none',
          clothingType: 'tactical-dark',
          glasses: false,
          accent: '#0ea5e9',
        };
      case 'EXP-13': // Guillermo 'Memo' Rivas
        return {
          name: "Guillermo 'Memo' Rivas",
          height: '1.78 m',
          age: '39 años',
          skin: '#d4a373',
          skinShadow: '#b07d58',
          hairColor: '#3f3f46',
          clothing: 'Overol de mecánico industrial manchado de grasa',
          type: 'male',
          hairStyle: 'backwards-cap',
          facialHair: 'stubble',
          clothingType: 'overalls',
          glasses: false,
          accent: '#f59e0b',
        };
      case 'EXP-14': // Esteban 'El Fantasma' Cordero
        return {
          name: "Esteban 'El Fantasma' Cordero",
          height: '1.83 m',
          age: '42 años',
          skin: '#c59b76',
          skinShadow: '#9c7352',
          hairColor: '#1f2937',
          clothing: 'Abrigo grueso de paño y bufanda oscura deshilachada',
          type: 'male',
          hairStyle: 'thick-wavy',
          facialHair: 'full-beard',
          clothingType: 'heavy-coat',
          glasses: false,
          accent: '#0ea5e9',
        };
      case 'EXP-15': // Lucía Pineda
        return {
          name: 'Lucía Pineda (Logística)',
          height: '1.65 m',
          age: '33 años',
          skin: '#ffd7ba',
          skinShadow: '#fec89a',
          hairColor: '#3b2f2f',
          clothing: 'Chaleco reflectante amarillo con gafete de almacén',
          type: 'female',
          hairStyle: 'shoulder-length',
          facialHair: 'none',
          clothingType: 'highvis',
          glasses: false,
          accent: '#64748b',
        };
      case 'EXP-16': // Felipe 'El Zurdo' Salgado
        return {
          name: "Felipe 'El Zurdo' Salgado",
          height: '1.75 m',
          age: '23 años',
          skin: '#fde2e4',
          skinShadow: '#fad2e1',
          hairColor: '#52525b',
          clothing: 'Cazadora de mezclilla gastada con cuello borrego',
          type: 'male',
          hairStyle: 'messy-crop',
          facialHair: 'none',
          clothingType: 'denim-shearling',
          glasses: false,
          accent: '#f43f5e',
        };
      case 'EXP-17': // Camila 'Viper' Orozco
        return {
          name: "Camila 'Viper' Orozco",
          height: '1.73 m',
          age: '36 años',
          skin: '#e9d8a6',
          skinShadow: '#ee9b00',
          hairColor: '#0f172a',
          clothing: 'Traje sastre gris marengo de alta dirección',
          type: 'female',
          hairStyle: 'sharp-bob',
          facialHair: 'none',
          clothingType: 'executive-suit',
          glasses: false,
          accent: '#0ea5e9',
        };
      case 'EXP-18': // Martín Paredes
        return {
          name: 'Martín Paredes (Electricista)',
          height: '1.79 m',
          age: '47 años',
          skin: '#d4a373',
          skinShadow: '#b07d58',
          hairColor: '#71717a',
          clothing: 'Camisa ignífuga naranja con tiras fosforescentes',
          type: 'male',
          hairStyle: 'receding-salt',
          facialHair: 'gray-mustache',
          clothingType: 'highvis-orange',
          glasses: false,
          accent: '#64748b',
        };
      case 'EXP-19': // Damián 'El Cuervo' Cruz
        return {
          name: "Damián 'El Cuervo' Cruz",
          height: '1.81 m',
          age: '32 años',
          skin: '#dfc7af',
          skinShadow: '#bfa084',
          hairColor: '#18181b',
          clothing: 'Chaqueta táctica impermeable negra con cuello subido',
          type: 'male',
          hairStyle: 'undercut',
          facialHair: 'clean-sharp',
          clothingType: 'tactical-dark',
          glasses: false,
          accent: '#0ea5e9',
        };
      case 'EXP-20': // Lorena Fuentes
        return {
          name: 'Lorena Fuentes (Forense)',
          height: '1.70 m',
          age: '40 años',
          skin: '#fad2e1',
          skinShadow: '#f28482',
          hairColor: '#422006',
          clothing: 'Bata azul petróleo con credencial del ministerio público',
          type: 'female',
          hairStyle: 'layered-hair',
          facialHair: 'none',
          clothingType: 'forensic-coat',
          glasses: true,
          accent: '#64748b',
        };
      default:
        return {
          name: alias,
          height: '1.75 m',
          age: '35 años',
          skin: '#d4a373',
          skinShadow: '#aa7850',
          hairColor: '#1c1917',
          clothing: 'Indumentaria civil estándar',
          type: 'male',
          hairStyle: 'short-fade',
          facialHair: 'none',
          clothingType: 'leather',
          glasses: false,
          accent: accentColor,
        };
    }
  };

  const profile = getSuspectProfile(code);

  // SVG Portrait Generator rendering distinctive photographic-style character illustration
  const renderSVGPortrait = (isLarge: boolean = false) => {
    return (
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Wall background gradient */}
          <linearGradient id={`wallGrad_${code}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#090d16" />
          </linearGradient>

          {/* Skin tones gradient */}
          <linearGradient id={`skinGrad_${code}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={profile.skin} />
            <stop offset="100%" stopColor={profile.skinShadow} />
          </linearGradient>

          {/* Facial highlight */}
          <radialGradient id={`faceHighlight_${code}`} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </radialGradient>

          {/* Camera Flash Specular Glow */}
          <radialGradient id={`flash_${code}`} cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
          </radialGradient>
        </defs>

        {/* 1. Police mugshot wall background with measurement lines */}
        <rect width="200" height="240" fill={`url(#wallGrad_${code})`} />

        {/* Height measurement ticks and labels */}
        <g stroke="#334155" strokeWidth="0.8" opacity="0.65">
          <line x1="10" y1="40" x2="190" y2="40" />
          <line x1="10" y1="65" x2="190" y2="65" />
          <line x1="10" y1="90" x2="190" y2="90" />
          <line x1="10" y1="115" x2="190" y2="115" />
          <line x1="10" y1="140" x2="190" y2="140" />
        </g>
        <g fill="#475569" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
          <text x="14" y="38">1.90m</text>
          <text x="14" y="63">1.80m</text>
          <text x="14" y="88">1.70m</text>
          <text x="14" y="113">1.60m</text>
          <text x="14" y="138">1.50m</text>

          <text x="165" y="38">6&apos;3&quot;</text>
          <text x="165" y="63">5&apos;11&quot;</text>
          <text x="165" y="88">5&apos;7&quot;</text>
          <text x="165" y="113">5&apos;3&quot;</text>
        </g>

        {/* 2. Character Torso and Clothing */}
        <g id="body">
          {/* Base shoulders */}
          <path
            d="M20 240 L35 170 Q60 148 100 148 Q140 148 165 170 L180 240 Z"
            fill={
              profile.clothingType === 'leather'
                ? '#1e1b18'
                : profile.clothingType === 'suit'
                ? '#1e293b'
                : profile.clothingType === 'labcoat'
                ? '#f8fafc'
                : profile.clothingType === 'police'
                ? '#0f172a'
                : profile.clothingType === 'scrubs'
                ? '#0d9488'
                : profile.clothingType === 'highvis'
                ? '#ca8a04'
                : profile.clothingType === 'highvis-orange'
                ? '#ea580c'
                : profile.clothingType === 'denim'
                ? '#1d4ed8'
                : profile.clothingType === 'courier'
                ? '#e11d48'
                : profile.clothingType === 'tweed'
                ? '#57534e'
                : profile.clothingType === 'hoodie'
                ? '#18181b'
                : '#1f2937'
            }
          />

          {/* Clothing collar details & textures */}
          {profile.clothingType === 'suit' && (
            <g stroke="#ffffff" strokeWidth="1" opacity="0.8">
              <path d="M85 150 L100 185 L115 150" fill="#f8fafc" />
              <polygon points="97,185 103,185 100,240" fill="#dc2626" />
            </g>
          )}

          {profile.clothingType === 'labcoat' && (
            <g fill="#e2e8f0">
              <path d="M88 150 L100 180 L112 150" fill="#93c5fd" />
              <rect x="125" y="175" width="16" height="22" rx="2" fill="#0284c7" />
              <line x1="128" y1="182" x2="138" y2="182" stroke="#ffffff" strokeWidth="1.5" />
            </g>
          )}

          {profile.clothingType === 'highvis' && (
            <g>
              <rect x="50" y="165" width="100" height="12" fill="#e2e8f0" opacity="0.85" />
              <rect x="75" y="150" width="10" height="90" fill="#e2e8f0" opacity="0.85" />
              <rect x="115" y="150" width="10" height="90" fill="#e2e8f0" opacity="0.85" />
            </g>
          )}

          {profile.clothingType === 'police' && (
            <g>
              <rect x="38" y="170" width="18" height="6" rx="2" fill="#eab308" />
              <rect x="144" y="170" width="18" height="6" rx="2" fill="#eab308" />
              <circle cx="65" cy="180" r="5" fill="#facc15" />
            </g>
          )}

          {profile.clothingType === 'hoodie' && (
            <path
              d="M60 148 Q100 170 140 148 L146 160 Q100 185 54 160 Z"
              fill="#27272a"
            />
          )}

          {/* Neck */}
          <rect
            x="85"
            y="120"
            width="30"
            height="36"
            rx="4"
            fill={`url(#skinGrad_${code})`}
          />
          {/* Neck shadow */}
          <path d="M85 120 Q100 135 115 120 L115 130 Q100 145 85 130 Z" fill="#000000" opacity="0.25" />
        </g>

        {/* 3. Head & Face */}
        <g id="head">
          {/* Ear left & right */}
          <ellipse cx="66" cy="98" rx="6" ry="11" fill={`url(#skinGrad_${code})`} />
          <ellipse cx="134" cy="98" rx="6" ry="11" fill={`url(#skinGrad_${code})`} />
          <path d="M66 94 Q63 98 66 102" stroke="#000000" strokeWidth="1" fill="none" opacity="0.4" />
          <path d="M134 94 Q137 98 134 102" stroke="#000000" strokeWidth="1" fill="none" opacity="0.4" />

          {/* Face base */}
          <ellipse
            cx="100"
            cy="95"
            rx="33"
            ry="40"
            fill={`url(#skinGrad_${code})`}
          />
          {/* Chin definition */}
          <path
            d="M75 90 Q100 145 125 90 Q100 85 75 90 Z"
            fill={`url(#skinGrad_${code})`}
          />
          {/* Face 3D lighting shader */}
          <ellipse
            cx="100"
            cy="95"
            rx="33"
            ry="40"
            fill={`url(#faceHighlight_${code})`}
          />

          {/* Eyebrows */}
          <path
            d={profile.type === 'female' ? "M77 82 Q87 79 93 83" : "M76 82 Q86 78 94 82"}
            stroke={profile.hairColor}
            strokeWidth={profile.type === 'female' ? "2" : "3.5"}
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={profile.type === 'female' ? "M107 83 Q113 79 123 82" : "M106 82 Q114 78 124 82"}
            stroke={profile.hairColor}
            strokeWidth={profile.type === 'female' ? "2" : "3.5"}
            strokeLinecap="round"
            fill="none"
          />

          {/* Eyes */}
          <g id="eyes">
            {/* Left Eye */}
            <ellipse cx="85" cy="90" rx="6" ry="3.5" fill="#ffffff" />
            <circle cx="85" cy="90" r="2.8" fill="#262626" />
            <circle cx="84" cy="89" r="1" fill="#ffffff" />

            {/* Right Eye */}
            <ellipse cx="115" cy="90" rx="6" ry="3.5" fill="#ffffff" />
            <circle cx="115" cy="90" r="2.8" fill="#262626" />
            <circle cx="114" cy="89" r="1" fill="#ffffff" />
          </g>

          {/* Glasses if applicable */}
          {profile.glasses && (
            <g stroke="#94a3b8" strokeWidth="1.8" fill="rgba(255,255,255,0.15)">
              <rect x="76" y="83" width="18" height="13" rx="3" />
              <rect x="106" y="83" width="18" height="13" rx="3" />
              <line x1="94" y1="89" x2="106" y2="89" />
              <line x1="76" y1="88" x2="68" y2="92" />
              <line x1="124" y1="88" x2="132" y2="92" />
            </g>
          )}

          {/* Nose */}
          <path
            d="M99 87 L96 103 Q100 106 104 103 Z"
            fill={profile.skinShadow}
            opacity="0.75"
          />

          {/* Lips */}
          <path
            d="M89 116 Q100 120 111 116"
            stroke="#9f1239"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />
          <path
            d="M92 116 Q100 124 108 116"
            stroke="#881337"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />

          {/* Facial Hair (Beard / Stubble / Mustache) */}
          {profile.facialHair === 'stubble' && (
            <path
              d="M82 108 Q100 134 118 108 Q118 126 100 132 Q82 126 82 108 Z"
              fill={profile.hairColor}
              opacity="0.25"
            />
          )}

          {profile.facialHair === 'beard' && (
            <path
              d="M75 102 Q100 144 125 102 Q125 130 100 138 Q75 130 75 102 Z"
              fill={profile.hairColor}
              opacity="0.85"
            />
          )}

          {profile.facialHair === 'goatee' && (
            <g fill={profile.hairColor} opacity="0.85">
              <ellipse cx="100" cy="122" rx="7" ry="6" />
              <path d="M93 111 Q100 114 107 111 L105 113 Q100 115 95 113 Z" />
            </g>
          )}

          {profile.facialHair === 'mustache' && (
            <path
              d="M86 112 Q100 110 114 112 Q100 117 86 112 Z"
              fill={profile.hairColor}
              opacity="0.9"
            />
          )}

          {profile.facialHair === 'gray-mustache' && (
            <path
              d="M86 112 Q100 110 114 112 Q100 117 86 112 Z"
              fill="#a1a1aa"
              opacity="0.95"
            />
          )}
        </g>

        {/* 4. Distinctive Hairstyles */}
        <g id="hair">
          {profile.hairStyle === 'short-fade' && (
            <path
              d="M66 85 Q65 52 100 50 Q135 52 134 85 Q125 65 100 64 Q75 65 66 85 Z"
              fill={profile.hairColor}
            />
          )}

          {profile.hairStyle === 'cyber-dyed' && (
            <g fill={profile.hairColor}>
              <path d="M64 88 Q65 48 100 48 Q135 48 136 88 L140 120 Q125 70 100 66 Q75 70 60 120 Z" />
              {/* Vibrant cyan lock */}
              <path d="M65 60 Q75 90 68 115 Q64 90 65 60 Z" fill="#22d3ee" />
            </g>
          )}

          {profile.hairStyle === 'beanie' && (
            <g>
              <ellipse cx="100" cy="62" rx="36" ry="24" fill="#09090b" />
              <rect x="63" y="66" width="74" height="15" rx="3" fill="#27272a" />
            </g>
          )}

          {profile.hairStyle === 'backwards-cap' && (
            <g>
              <ellipse cx="100" cy="62" rx="35" ry="22" fill="#b91c1c" />
              <path d="M72 70 L128 70 L136 78 L64 78 Z" fill="#7f1d1d" />
            </g>
          )}

          {profile.hairStyle === 'cap-curls' && (
            <g>
              <ellipse cx="100" cy="64" rx="36" ry="22" fill="#0284c7" />
              <rect x="64" y="66" width="72" height="12" rx="3" fill="#0369a1" />
              {/* Curly hair pouring under cap */}
              <circle cx="64" cy="90" r="7" fill={profile.hairColor} />
              <circle cx="136" cy="90" r="7" fill={profile.hairColor} />
            </g>
          )}

          {profile.hairStyle === 'formal-updo' && (
            <g fill={profile.hairColor}>
              <ellipse cx="100" cy="48" rx="22" ry="16" />
              <path d="M66 85 Q65 54 100 54 Q135 54 134 85 Q118 68 100 68 Q82 68 66 85 Z" />
            </g>
          )}

          {profile.hairStyle === 'high-ponytail' && (
            <g fill={profile.hairColor}>
              <path d="M66 85 Q65 52 100 50 Q135 52 134 85 Q125 65 100 64 Q75 65 66 85 Z" />
              {/* High ponytail flowing right */}
              <path d="M125 50 Q155 58 152 95 Q144 80 135 68 Z" />
            </g>
          )}

          {profile.hairStyle === 'sharp-bob' && (
            <path
              d="M62 88 Q65 48 100 48 Q135 48 138 88 L142 120 L128 105 Q115 68 100 68 Q85 68 72 105 L58 120 Z"
              fill={profile.hairColor}
            />
          )}

          {profile.hairStyle === 'shoulder-length' && (
            <g fill={profile.hairColor}>
              <path d="M64 88 Q65 50 100 50 Q135 50 136 88 L142 140 Q132 105 125 80 Q100 66 75 80 Q68 105 58 140 Z" />
            </g>
          )}

          {profile.hairStyle === 'receding-grey' && (
            <g fill={profile.hairColor}>
              <path d="M66 88 Q65 68 76 65 Q85 75 100 75 Q115 75 124 65 Q135 68 134 88 Q125 78 100 78 Q75 78 66 88 Z" />
              <ellipse cx="66" cy="80" rx="3" ry="12" />
              <ellipse cx="134" cy="80" rx="3" ry="12" />
            </g>
          )}

          {profile.hairStyle === 'silver-temples' && (
            <g fill={profile.hairColor}>
              <path d="M66 85 Q65 52 100 50 Q135 52 134 85 Q125 65 100 64 Q75 65 66 85 Z" />
              {/* Silver grey streaks */}
              <path d="M66 82 Q74 68 84 66" stroke="#e2e8f0" strokeWidth="2" fill="none" opacity="0.8" />
              <path d="M134 82 Q126 68 116 66" stroke="#e2e8f0" strokeWidth="2" fill="none" opacity="0.8" />
            </g>
          )}

          {profile.hairStyle === 'neat-part' && (
            <path
              d="M66 85 Q65 50 90 48 L135 55 Q135 75 134 85 Q120 62 100 62 Q75 62 66 85 Z"
              fill={profile.hairColor}
            />
          )}

          {profile.hairStyle === 'slicked-back' && (
            <path
              d="M66 85 Q65 46 100 46 Q135 46 134 85 Q125 60 100 60 Q75 60 66 85 Z"
              fill={profile.hairColor}
            />
          )}

          {profile.hairStyle === 'thick-wavy' && (
            <path
              d="M64 88 Q60 48 100 44 Q140 48 136 88 Q124 62 100 62 Q76 62 64 88 Z"
              fill={profile.hairColor}
            />
          )}

          {profile.hairStyle === 'messy-crop' && (
            <g fill={profile.hairColor}>
              <path d="M65 85 Q65 50 100 48 Q135 50 135 85 Q125 65 100 65 Q75 65 65 85 Z" />
              <polygon points="90,46 95,38 102,46" />
              <polygon points="106,47 114,40 118,48" />
              <polygon points="78,50 84,42 88,51" />
            </g>
          )}

          {profile.hairStyle === 'undercut' && (
            <path
              d="M68 82 Q68 50 100 46 Q132 50 132 82 Q120 58 100 58 Q80 58 68 82 Z"
              fill={profile.hairColor}
            />
          )}

          {profile.hairStyle === 'police-bun' && (
            <g fill={profile.hairColor}>
              <ellipse cx="100" cy="50" rx="18" ry="12" />
              <path d="M66 85 Q65 56 100 56 Q135 56 134 85 Q125 68 100 68 Q75 68 66 85 Z" />
            </g>
          )}
        </g>

        {/* 5. Biometric Facial Recognition HUD Overlay */}
        <g id="biometricHUD" opacity="0.85">
          {/* Facial bounding box */}
          <rect
            x="60"
            y="65"
            width="80"
            height="85"
            rx="4"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="0.9"
            strokeDasharray="4 2"
          />
          {/* Reticle corner brackets */}
          <path d="M60 75 L60 65 L70 65" fill="none" stroke="#22d3ee" strokeWidth="2" />
          <path d="M140 75 L140 65 L130 65" fill="none" stroke="#22d3ee" strokeWidth="2" />
          <path d="M60 140 L60 150 L70 150" fill="none" stroke="#22d3ee" strokeWidth="2" />
          <path d="M140 140 L140 150 L130 150" fill="none" stroke="#22d3ee" strokeWidth="2" />

          {/* Facial feature tracking crosshairs */}
          <circle cx="85" cy="90" r="1.5" fill="#38bdf8" />
          <circle cx="115" cy="90" r="1.5" fill="#38bdf8" />
          <circle cx="100" cy="104" r="1.5" fill="#38bdf8" />
          <circle cx="100" cy="118" r="1.5" fill="#38bdf8" />

          {/* HUD scanline and live match telemetry */}
          <rect x="62" y="142" width="76" height="7" fill="#082f49" rx="1.5" opacity="0.9" />
          <text x="65" y="147.5" fill="#38bdf8" fontSize="4.8" fontFamily="monospace" fontWeight="bold">
            FACIAL ID MATCH: 98.4%
          </text>
        </g>

        {/* 6. Police Mugshot Placard at bottom */}
        {showPlacard && (
          <g id="placard">
            <rect x="22" y="200" width="156" height="34" rx="3" fill="#020617" stroke="#334155" strokeWidth="1.2" />
            <rect x="26" y="203" width="148" height="28" rx="2" fill="#0f172a" />
            <text x="100" y="212" fill="#94a3b8" fontSize="5.2" fontFamily="monospace" fontWeight="bold" textAnchor="middle" letterSpacing="0.8">
              DEP. POLICÍA METROPOLITANA · FORENSIC ID
            </text>
            <text x="100" y="221" fill="#38bdf8" fontSize="7.5" fontFamily="monospace" fontWeight="black" textAnchor="middle">
              {code} · {alias.length > 22 ? alias.substring(0, 20) + '…' : alias}
            </text>
            <text x="100" y="228" fill="#64748b" fontSize="4.8" fontFamily="monospace" textAnchor="middle">
              ESTATURA: {profile.height} · EDAD: {profile.age}
            </text>
          </g>
        )}

        {/* Camera Vignette & Lens Glare Overlay */}
        <rect width="200" height="240" fill={`url(#flash_${code})`} pointerEvents="none" />
        <rect width="200" height="240" fill="none" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.3" pointerEvents="none" />
      </svg>
    );
  };

  return (
    <>
      {/* Interactive Photo Thumbnail Container */}
      <div
        onClick={() => setIsZoomed(true)}
        className={`group relative rounded-xl bg-slate-950 border border-slate-700/80 overflow-hidden shadow-xl cursor-pointer hover:border-cyan-400 transition-all duration-200 ${className}`}
        title="Clic para ampliar foto forense del expediente"
        style={{
          boxShadow: `0 8px 24px -6px rgba(0, 0, 0, 0.7), 0 0 16px -4px ${profile.accent}20`,
        }}
      >
        {/* Render the full SVG Portrait */}
        {renderSVGPortrait(false)}

        {/* Top Camera HUD badge */}
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-700/80 text-[10px] text-cyan-400 font-mono">
          <Camera className="w-3 h-3 text-cyan-400" />
          <span className="font-bold">{code}</span>
        </div>

        {/* Expand button hover affordance */}
        <div className="absolute bottom-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-slate-900/90 text-cyan-300 border border-cyan-500/50 shadow-md">
          <Maximize2 className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Enlarged Forensic Photo Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="bg-slate-900 border border-cyan-500/50 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 px-6 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2.5">
                <Scan className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    Ficha Fotográfica Forense · {code}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Registro biométrico de identidad judicial
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsZoomed(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: High Resolution Portrait */}
            <div className="p-6 flex flex-col items-center">
              <div className="w-64 h-80 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl relative bg-slate-950">
                {renderSVGPortrait(true)}
              </div>

              {/* Suspect file specs strip */}
              <div className="w-full mt-5 grid grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 font-mono block text-[10px] uppercase">
                    Nombre o Alias
                  </span>
                  <span className="font-bold text-white">{profile.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono block text-[10px] uppercase">
                    Estatura / Edad
                  </span>
                  <span className="font-mono text-cyan-300">
                    {profile.height} · {profile.age}
                  </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-800">
                  <span className="text-slate-500 font-mono block text-[10px] uppercase">
                    Indumentaria en Custodia
                  </span>
                  <span className="text-slate-300">{profile.clothing}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsZoomed(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
              >
                Cerrar Fotografía
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
