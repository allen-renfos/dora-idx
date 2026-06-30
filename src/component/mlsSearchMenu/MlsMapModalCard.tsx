"use client"
import { IoMdClose } from "react-icons/io";
import { IoBedOutline } from "react-icons/io5";
import { PiBathtub } from "react-icons/pi";
import { BiArea } from "react-icons/bi";
import { FiMapPin } from "react-icons/fi";
import Image from "next/image";
import { MlsProviderBadge } from "@/component/sharable/MlsProviderBadge";

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
            background: 'var(--cream)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            fontFamily: 'var(--font-lato), sans-serif',
            boxShadow: 'var(--shadow-lift)',
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
                        background: 'rgba(255,255,255,0.85)',
                        border: '1px solid var(--line)',
                        borderRadius: '50%',
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--ink)',
                        cursor: 'pointer',
                        zIndex: 10,
                        backdropFilter: 'blur(4px)',
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
                    fontSize: 24,
                    fontWeight: 400,
                    fontFamily: 'var(--font-arapey), Georgia, serif',
                    color: 'var(--ink)',
                    letterSpacing: '-0.5px',
                }}>
                    ${Number(item.price).toLocaleString()}
                </div>

                {/* Beds / Baths / Sqft */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--ink-soft)', fontSize: 13 }}>
                        <IoBedOutline size={15} color="var(--accent)" />
                        <span>{item.beds ?? '—'} Beds</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--ink-soft)', fontSize: 13 }}>
                        <PiBathtub size={15} color="var(--accent)" />
                        <span>{item.baths ?? '—'} Baths</span>
                    </div>
                    {sqft && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--ink-soft)', fontSize: 13 }}>
                            <BiArea size={15} color="var(--accent)" />
                            <span>{Number(sqft).toLocaleString()} Sq Ft</span>
                        </div>
                    )}
                </div>

                {/* Address */}
                {item.address && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                        <FiMapPin size={13} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.4, fontFamily: 'var(--font-arapey), Georgia, serif' }}>
                            {String(item.address).replace(/±/g, '#')}
                        </span>
                    </div>
                )}

                {/* MLS attribution */}
                <MlsProviderBadge item={item} />
            </div>
        </div>
    );
}
