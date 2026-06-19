import { FiPhone } from "react-icons/fi";
import { FiPaperclip, FiSend } from 'react-icons/fi';
import Image from "next/image";

const MyAgentPage = () => {
    return (
        <main className="flex-1 p-10 bg-[#ffffff] min-h-screen main-content-p ">
            {/* Top Bar #171717         // main-content-pt*/}
            <div className="flex justify-between items-center mb-8 content-border
                    border-[#e7e4de] p-4 rounded-none ">
                <p className="font60 font-sans font-semibold text-shadow-none text-[#1a1a1a]">
                    My Agent
                </p>
                <button className="flex padding2 items-center gap-2 bg-[#1a1a1a] text-white px-6 py-2 rounded-none font-semibold hover:bg-[#333230] transition">
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
                    <div className="flex-1 flex flex-col gap-4 bg-[#fafaf8] paddingB5
                     border border-[#e7e4de] rounded-none  items-start">
                        <div className="flex w-full mb-8 content-border border-[#e7e4de] p-4 rounded-none
                        items-left padding2 mb0">
                            <p className="font20 font-sans font-semibold text-shadow-none text-[#1a1a1a]">
                                About Bio
                            </p>
                        </div>
                        <div className="flex w-full gap-4 padding2">
                            <div className="flex flex-col max-w-1/2">
                                <div
                                    className="rounded-none overflow-hidden border border-gray-400"
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
                                <p className="font20 font-sans font-semibold text-shadow-none text-[#1a1a1a]">
                                    George Jhon
                                </p>
                                <p className="font14 font-sans font-semibold text-shadow-none text-[#8a8780]">
                                    RealtiPro Platform
                                </p>

                                <div className="flex mt10">
                                    <FiPhone color="#a6824c" style={{ marginTop: "1%" }} />
                                    <span className="font14 font-sans font-semibold
                                                text-shadow-none text-[#8a6a3b]">
                                        +123 456 78900
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 ">
                                <p className="font16 font-sans font-semibold text-shadow-none text-justify text-[#555350]">
                                    George Jhon is a dependable and accomplished real estate professional serving the greater Seattle area. She has called Redmond home for over 20 years, giving her a deep understanding of the local market and community.


                                </p>
                                <p className="font16 font-sans font-semibold text-shadow-none text-justify paddingT5 text-[#555350]">
                                    Lincy’s clients are her top priority, and she is committed to walking with them every step of the way—from the initial consultation to closing. Her approachable personality, positive outlook, and cheerful demeanor make connecting with her effortless, fostering trust and collaboration.
                                    With a background in interior design and digital marketing, Lincy brings added value to her clients by offering expert advice on property staging and innovative marketing strategies.&nbsp;Whether you&apos;re buying your dream home, selling your current property, or expanding your investment portfolio

                                </p>
                                <p className="font16 font-sans font-semibold text-shadow-none text-justify paddingT5 text-[#555350]">
                                    Lincy is honored to guide you and contribute to your success story.

                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-4 bg-[#fafaf8] border border-[#e7e4de] paddingB5
                rounded-none  items-start marginTop">
                        <div className="flex w-full mb-8 content-border border-[#e7e4de] p-4 rounded-none
                        items-left padding2">
                            <p className="font20 font-sans font-semibold text-shadow-none text-[#1a1a1a]">
                                Contact Your Agent
                            </p>
                        </div>
                        <div className="flex flex-col items-start w-full pl-[5px] paddingLeft3 padding2">
                            <p className="font16 font-sans text-[#555350]">Subject</p>
                            <input className="font14 font-sans marginTop15 text-[#1a1a1a]
                             text-shadow-none border border-[#e7e4de] rounded-none padding2 w-full"
                                placeholder="Write your subject" />
                        </div>
                        <div className="flex flex-col items-start w-full pl-[5px] paddingLeft3 padding2">
                            <p className="font16 font-sans text-[#555350]">Message</p>
                            <input className="font14 font-sans  h-[150px] marginTop15 text-[#1a1a1a]
                             text-shadow-none border border-[#e7e4de] rounded-none padding2 w-full"
                                placeholder="Enter your message here" />
                        </div>
                        <div className="flex flex-col items-end w-full pl-[5px] paddingLeft3 padding2">
                            <button className="flex items-center gap-2 bg-[#1a1a1a]  w-[25%] padding2
                    text-center justify-center
                    text-white px-6 py-2 rounded-none font-semibold hover:bg-[#333230]
                    transition mt10">
                                Send
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-1/3 flex flex-1 bg-[#fafaf8] border border-[#e7e4de]
                rounded-none
                items-center flex-col">
                    <div className="flex w-full mb-8 content-border border-[#e7e4de] p-4
                    rounded-none items-left padding2 mb0">
                        <div
                            className="rounded-none overflow-hidden border border-gray-400"
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
                        <p className="font20 font-sans content-center font-semibold text-shadow-none text-[#1a1a1a]">
                            George Jhon
                        </p>
                    </div>
                    <div className="flex flex-col item-center  h-full text-center bg-[#f4f2ec]">
                        <Image
                            src="/images/chat-img.png"
                            alt="chat-image"
                            width={200}
                            height={120}
                            className="paddingTop20"
                        />
                        <p className="font20 font-sans  content-center
                    font-semibold text-shadow-none text-[#1a1a1a]">
                            Let&apos;s start Chatting
                        </p>
                        <p className="font16 font-sans  content-center text-[#8a8780]
                    font-semibold text-shadow-none">
                            Directly communicate with your agent. Ask questions, sent properties, and so much more. Send your first Message to get started!
                        </p>
                    </div>





                    <div className=" border-t border-[#e7e4de] bg-[#fafaf8] padding2 bottom-border">
                        <div className="flex items-center gap-1 padding2">
                            {/* Attachment Button */}
                            <button
                                className=" rounded-none  border-2 border-[#a6824c]
                            flex items-center justify-center hover:bg-[#eece9a] hover:bg-opacity-10
                            transition-colors attach-padding">
                                <FiPaperclip className="text-[#8a6a3b] hover:text-[#1a1a1a] w-4 h-4" />
                            </button>

                            {/* Message Input */}
                            <input
                                type="text"
                                // value={message}
                                // onChange={(e) => setMessage(e.target.value)}
                                // onKeyPress={handleKeyPress}
                                placeholder="Enter message here"
                                className="padding2 bg-[#efebe4] border border-[#e7e4de] font14 w-[90%]
                                rounded-none px-4 py-3 text-[#1a1a1a] placeholder-[#8a8780]
                                 focus:outline-none focus:border-[#a6824c] transition-colors"
                            />



                            {/* Send Button */}
                            <button
                                // onClick={handleSendMessage}
                                // disabled={!message.trim()}
                                className="bg-[#1a1a1a]  padding1 text-white px-6 py-3 rounded-none font-semibold hover:bg-[#333230] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                bg-[#f4f2ec]  mx-auto padding2 border border-[#e7e4de]">
                <div className="max-w-1/2 flex flex-col  justify-center">

                    <div className="text-base text-[#1a1a1a] text-[22px]">
                        Get the Realtipro Home App
                    </div>
                    <div className="text-base text-[#8a8780] text-[16px] ">
                        Don’t miss out on the perfect home for you, connecting instantly with your agent, and so much more.                        </div>

                </div>
                <div className="flex-3 text-left padding2 paddingRight10 ">
                    <div className="flex-1 w-full mt5">
                        <button className="flex p-8 items-center gap-3 bg-[#efebe4] border
                            border-[#e7e4de] text-[#8a8780] rounded-none  text-center w-full
                            hover:bg-[#e7e4de] transition padding2 justify-center">
                            {/* px-6 py-2 */}

                            Mobile Number
                        </button>
                    </div>
                    <div className="w-full mt5">
                        <button className="flex p-4 items-center padding2
                gap-3 bg-[#1a1a1a] text-white rounded-none text-center w-full
                hover:bg-[#333230] transition padding2 justify-center">
                            Text Me This Free App
                        </button>
                    </div>
                    <div className="text-base text-[#8a8780] text-[12px] flex justify-center mt-4">
                        Standard messaging rates apply.
                    </div>
                </div>
            </div>
        </main>
    )
}
export default MyAgentPage;