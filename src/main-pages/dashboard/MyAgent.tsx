import { FiPhone } from "react-icons/fi";
import { FiPaperclip, FiSend } from 'react-icons/fi';
import Image from "next/image";

const MyAgentPage = () => {
    return (
        <main className="flex-1 p-10 bg-[var(--canvas)] min-h-screen main-content-p ">
            {/* Top Bar #171717         // main-content-pt*/}
            <div className="flex justify-between items-center mb-8 content-border
                    border-[var(--line)] p-4 rounded-none ">
                <p className="font60 font-sans font-semibold text-shadow-none text-[var(--ink)]">
                    My Agent
                </p>
                <button className="flex padding2 items-center gap-2 bg-[var(--pine)] text-[var(--on-pine)] px-6 py-2 rounded-none font-semibold hover:bg-[var(--pine-soft)] transition">
                    {/* <FaPlus /> */}
                    <Image
                        src="/images/logout-icon.png"
                        alt="Logout Icon"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                    />

                    Logout
                </button>
            </div>
            <div className=" p-2 flex flex-row w-full justify-center gap-2 ">
                <div className="flex flex-col flex-1">
                    <div className="flex-1 flex flex-col gap-4 bg-[var(--cream)] paddingB5
                     border border-[var(--line)] rounded-none  items-start">
                        <div className="flex w-full mb-8 content-border border-[var(--line)] p-4 rounded-none
                        items-left padding2 mb0">
                            <p className="font20 font-sans font-semibold text-shadow-none text-[var(--ink)]">
                                About Bio
                            </p>
                        </div>
                        <div className="flex w-full gap-4 padding2">
                            <div className="flex flex-col max-w-1/2">
                                <div
                                    className="rounded-none overflow-hidden border border-[var(--line)]"
                                    style={{ width: "90px", height: "90px" }}
                                >
                                    <Image
                                        src="/images/my-profile-pic.png"
                                        alt="Profile"
                                        width={90}
                                        height={90}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <p className="font20 font-sans font-semibold text-shadow-none text-[var(--ink)]">
                                    George Jhon
                                </p>
                                <p className="font14 font-sans font-semibold text-shadow-none text-[var(--ink-faint)]">
                                    RealtiPro Platform
                                </p>

                                <div className="flex mt10">
                                    <FiPhone color="var(--sage-deep)" style={{ marginTop: "1%" }} />
                                    <span className="font14 font-sans font-semibold
                                                text-shadow-none text-[var(--sage-deep)]">
                                        +123 456 78900
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 ">
                                <p className="font16 font-sans font-semibold text-shadow-none text-justify text-[var(--ink-soft)]">
                                    George Jhon is a dependable and accomplished real estate professional serving the greater Seattle area. She has called Redmond home for over 20 years, giving her a deep understanding of the local market and community.


                                </p>
                                <p className="font16 font-sans font-semibold text-shadow-none text-justify paddingT5 text-[var(--ink-soft)]">
                                    Lincy’s clients are her top priority, and she is committed to walking with them every step of the way—from the initial consultation to closing. Her approachable personality, positive outlook, and cheerful demeanor make connecting with her effortless, fostering trust and collaboration.
                                    With a background in interior design and digital marketing, Lincy brings added value to her clients by offering expert advice on property staging and innovative marketing strategies.&nbsp;Whether you&apos;re buying your dream home, selling your current property, or expanding your investment portfolio

                                </p>
                                <p className="font16 font-sans font-semibold text-shadow-none text-justify paddingT5 text-[var(--ink-soft)]">
                                    Lincy is honored to guide you and contribute to your success story.

                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-4 bg-[var(--cream)] border border-[var(--line)] paddingB5
                rounded-none  items-start marginTop">
                        <div className="flex w-full mb-8 content-border border-[var(--line)] p-4 rounded-none
                        items-left padding2">
                            <p className="font20 font-sans font-semibold text-shadow-none text-[var(--ink)]">
                                Contact Your Agent
                            </p>
                        </div>
                        <div className="flex flex-col items-start w-full pl-[5px] paddingLeft3 padding2">
                            <p className="font16 font-sans text-[var(--ink-soft)]">Subject</p>
                            <input className="font14 font-sans marginTop15 text-[var(--ink)]
                             text-shadow-none border border-[var(--line)] rounded-none padding2 w-full"
                                placeholder="Write your subject" />
                        </div>
                        <div className="flex flex-col items-start w-full pl-[5px] paddingLeft3 padding2">
                            <p className="font16 font-sans text-[var(--ink-soft)]">Message</p>
                            <input className="font14 font-sans  h-[150px] marginTop15 text-[var(--ink)]
                             text-shadow-none border border-[var(--line)] rounded-none padding2 w-full"
                                placeholder="Enter your message here" />
                        </div>
                        <div className="flex flex-col items-end w-full pl-[5px] paddingLeft3 padding2">
                            <button className="flex items-center gap-2 bg-[var(--pine)]  w-[25%] padding2
                    text-center justify-center
                    text-[var(--on-pine)] px-6 py-2 rounded-none font-semibold hover:bg-[var(--pine-soft)]
                    transition mt10">
                                Send
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-1/3 flex flex-1 bg-[var(--cream)] border border-[var(--line)]
                rounded-none
                items-center flex-col">
                    <div className="flex w-full mb-8 content-border border-[var(--line)] p-4
                    rounded-none items-left padding2 mb0">
                        <div
                            className="rounded-none overflow-hidden border border-[var(--line)]"
                            style={{ width: "50px", height: "50px" }}
                        >
                            <Image
                                src="/images/my-profile-pic.png"
                                alt="Profile"
                                width={50}
                                height={50}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <p className="font20 font-sans content-center font-semibold text-shadow-none text-[var(--ink)]">
                            George Jhon
                        </p>
                    </div>
                    <div className="flex flex-col item-center  h-full text-center bg-[var(--canvas-2)]">
                        <Image
                            src="/images/chat-img.png"
                            alt="chat-image"
                            width={200}
                            height={120}
                            className="paddingTop20"
                        />
                        <p className="font20 font-sans  content-center
                    font-semibold text-shadow-none text-[var(--ink)]">
                            Let&apos;s start Chatting
                        </p>
                        <p className="font16 font-sans  content-center text-[var(--ink-faint)]
                    font-semibold text-shadow-none">
                            Directly communicate with your agent. Ask questions, sent properties, and so much more. Send your first Message to get started!
                        </p>
                    </div>





                    <div className=" border-t border-[var(--line)] bg-[var(--cream)] padding2 bottom-border">
                        <div className="flex items-center gap-1 padding2">
                            {/* Attachment Button */}
                            <button
                                className=" rounded-none  border-2 border-[var(--sage-deep)]
                            flex items-center justify-center hover:bg-[var(--canvas)] hover:bg-opacity-10
                            transition-colors attach-padding">
                                <FiPaperclip className="text-[var(--sage-deep)] hover:text-[var(--ink)] w-4 h-4" />
                            </button>

                            {/* Message Input */}
                            <input
                                type="text"
                                // value={message}
                                // onChange={(e) => setMessage(e.target.value)}
                                // onKeyPress={handleKeyPress}
                                placeholder="Enter message here"
                                className="padding2 bg-[var(--canvas)] border border-[var(--line)] font14 w-[90%]
                                rounded-none px-4 py-3 text-[var(--ink)] placeholder-[var(--ink-faint)]
                                 focus:outline-none focus:border-[var(--sage-deep)] transition-colors"
                            />



                            {/* Send Button */}
                            <button
                                // onClick={handleSendMessage}
                                // disabled={!message.trim()}
                                className="bg-[var(--pine)]  padding1 text-[var(--on-pine)] px-6 py-3 rounded-none font-semibold hover:bg-[var(--pine-soft)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <FiSend className="w-4 h-4" />
                                Send
                            </button>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
            </div>
            <div className="marginTop rounded-none p-8 min-h-[200px] flex flex-row  w-full justify-center
                bg-[var(--canvas-2)]  mx-auto padding2 border border-[var(--line)]">
                <div className="max-w-1/2 flex flex-col  justify-center">

                    <div className="text-base text-[var(--ink)] text-[22px]">
                        Get the Realtipro Home App
                    </div>
                    <div className="text-base text-[var(--ink-faint)] text-[16px] ">
                        Don’t miss out on the perfect home for you, connecting instantly with your agent, and so much more.                        </div>

                </div>
                <div className="flex-3 text-left padding2 paddingRight10 ">
                    <div className="flex-1 w-full mt5">
                        <button className="flex p-8 items-center gap-3 bg-[var(--canvas)] border
                            border-[var(--line)] text-[var(--ink-faint)] rounded-none  text-center w-full
                            hover:bg-[var(--canvas-2)] transition padding2 justify-center">
                            {/* px-6 py-2 */}

                            Mobile Number
                        </button>
                    </div>
                    <div className="w-full mt5">
                        <button className="flex p-4 items-center padding2
                gap-3 bg-[var(--pine)] text-[var(--on-pine)] rounded-none text-center w-full
                hover:bg-[var(--pine-soft)] transition padding2 justify-center">
                            Text Me This Free App
                        </button>
                    </div>
                    <div className="text-base text-[var(--ink-faint)] text-[12px] flex justify-center mt-4">
                        Standard messaging rates apply.
                    </div>
                </div>
            </div>
        </main>
    )
}
export default MyAgentPage;