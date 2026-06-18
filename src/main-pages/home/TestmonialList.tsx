"use client"
import { TestmonialCard } from "@/component/home/TestimonialCard"
import Providers from "@/provider/QueryClientProvider";
import { useTestimonialsList } from "@/services/testimonial/TestmonialQueris";
import { Testimonials } from "@/types/Tesimonials";
import { useEffect, useState } from "react";

const TestimonialList = () => {
    const [testimonials, setTestimonials] = useState<Testimonials[]>([]);

    const [currentPage, setCurrentPage] = useState(1);

    const { data: testimonialsListDatas, isLoading, error } = useTestimonialsList(currentPage);
    useEffect(() => {
        if (testimonialsListDatas && !isLoading && !error) {
            setTestimonials(testimonialsListDatas.data);
            setCurrentPage(testimonialsListDatas.meta.current_page);
        }


    }, [testimonialsListDatas, isLoading, error])
    return (
        <Providers>

            <div className="testimonials-grid">

                {testimonials.length ? (
                    <>
                        {testimonials.slice(0, 2).map((item, index) => (
                            <div key={index}>
                                <TestmonialCard item={item} index={index} />

                            </div>
                        ))}
                    </>
                ) : (
                    <div>No Testimonials found.</div>
                )}

            </div >
        </Providers>

    )
}
export default TestimonialList;