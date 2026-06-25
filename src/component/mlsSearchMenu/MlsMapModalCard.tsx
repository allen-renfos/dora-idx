"use client"
import { IoMdClose } from "react-icons/io";
import { IoBedOutline } from "react-icons/io5";
import { PiBathtub } from "react-icons/pi";
import { BiArea } from "react-icons/bi";
import { FiMapPin } from "react-icons/fi";
import Image from "next/image";

interface PropertyCardProps {
    item: any;
    onClose?: () => void;
}

export const MlsMapModalCard = ({ item, onClose }: PropertyCardProps) => {
    const handleViewProperty = (item: any) => {
        window.location.href = `/properties/${item.id}`;
    };

    const sqft = item.bua || item.LivingArea || item.square_footage || item.square_feet;

    return (
        <div style={{
            width: 280,
            background: '#111',
            border: '1px solid #333',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            fontFamily: 'var(--font-lato), sans-serif',
        }}>
            {/* Image */}
            <div style={{ position: 'relative', height: 160, cursor: 'pointer' }} onClick={() => handleViewProperty(item)}>
                <Image
                    src={Array.isArray(item.cover_photo) ? item.cover_photo[0] : (item.cover_photo || "/property-placeholder.png")}
                    alt="Property"
                    fill
                    style={{ objectFit: 'cover' }}
                    referrerPolicy="no-referrer"
                />
                {/* NWMLS badge */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/nwmls.png"
                    alt="NWMLS"
                    style={{ position: 'absolute', top: 8, left: 8, width: 24, height: 24, objectFit: 'contain', zIndex: 10 }}
                />

                <button
                    onClick={(e) => { e.stopPropagation(); onClose?.(); }}
                    style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: 'rgba(0,0,0,0.6)',
                        border: 'none',
                        borderRadius: '50%',
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        cursor: 'pointer',
                        zIndex: 10,
                    }}
                    aria-label="Close"
                >
                    <IoMdClose size={16} />
                </button>
            </div>

            {/* Info */}
            <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* Price */}
                <div style={{
                    fontSize: 23,
                    fontWeight: 400,
                    fontFamily: 'var(--font-arapey), Georgia, serif',
                    background: 'linear-gradient(135deg, #EDB75E 0%, #F5D08A 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.5px',
                }}>
                    ${Number(item.price).toLocaleString()}
                </div>

                {/* Beds / Baths / Sqft */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#c9c9c9', fontSize: 13 }}>
                        <IoBedOutline size={15} color="#EDB75E" />
                        <span>{item.beds ?? '—'} Beds</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#c9c9c9', fontSize: 13 }}>
                        <PiBathtub size={15} color="#EDB75E" />
                        <span>{item.baths ?? '—'} Baths</span>
                    </div>
                    {sqft && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#c9c9c9', fontSize: 13 }}>
                            <BiArea size={15} color="#EDB75E" />
                            <span>{Number(sqft).toLocaleString()} Sq Ft</span>
                        </div>
                    )}
                </div>

                {/* Address */}
                {item.address && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                        <FiMapPin size={13} color="#EDB75E" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 14, color: '#a0a0a0', lineHeight: 1.4, fontFamily: 'var(--font-arapey), Georgia, serif' }}>
                            {String(item.address).replace(/±/g, '#')}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
