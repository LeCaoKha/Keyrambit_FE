import { useState, useEffect } from "react";

// --- IMPORT TOÀN BỘ HÌNH ẢNH ---
import Akaza from "../../assets/images/Akaza.webp";
import All_Might from "../../assets/images/All_Might.webp";
import Arceus from "../../assets/images/Arceus.webp";
import Ashborn from "../../assets/images/Ashborn.webp";
import Bakugo from "../../assets/images/Bakugo.webp";
import Bellion from "../../assets/images/Bellion.webp";
import Beru from "../../assets/images/Beru.jpg";
import Chopper from "../../assets/images/Chopper.webp";
import Dialga from "../../assets/images/Dialga.png";
import Groudon from "../../assets/images/Groudon.png";
import Hancock from "../../assets/images/Hancock.webp";
import Igris from "../../assets/images/Igris.webp";
import Inosuke from "../../assets/images/Inosuke.webp";
import Iron from "../../assets/images/Iron.webp";
import Itachi from "../../assets/images/Itachi.jpg";
import Kyogre from "../../assets/images/Kyogre.png";
import Luffy from "../../assets/images/Luffy.jpg";
import Madara from "../../assets/images/Madara.jpg";
import Midoriya from "../../assets/images/Midoriya.webp";
import Mihawk from "../../assets/images/Mihawk.jpg";
import Naruto from "../../assets/images/Naruto.webp";
import Nezuko from "../../assets/images/Nezuko.jpg";
import Obito from "../../assets/images/Obito.jpg";
import Palkia from "../../assets/images/Palkia.png";
import Rayquaza from "../../assets/images/Rayquaza.jpg";
import Rengoku from "../../assets/images/Rengoku.avif";
import Sakura from "../../assets/images/Sakura.webp";
import Sasuke from "../../assets/images/Sasuke.avif";
import Shoto from "../../assets/images/Shoto.avif";
import Stain from "../../assets/images/Stain.webp";
import Tanjiro from "../../assets/images/Tanjiro.avif";
import Zenitsu from "../../assets/images/Zenitsu.jpg";

import Keyrambit_Logo from "../../assets/images/Keyrambit_Logo.png";
import Keyrambit_Word from "../../assets/images/Keyrambit_Word.png";
import Point_Asset from "../../assets/images/Point_Asset.png";

// --- DỮ LIỆU NHÂN VẬT ---
const charactersData = {
  de: [
    { name: "All Might", image: All_Might },
    { name: "Bakugo", image: Bakugo },
    { name: "Chopper", image: Chopper },
    { name: "Beru", image: Beru },
    { name: "Groudon", image: Groudon },
    { name: "Hancock", image: Hancock },
    { name: "Inosuke", image: Inosuke },
    { name: "Itachi", image: Itachi },
    { name: "Luffy", image: Luffy },
    { name: "Madara", image: Madara },
    { name: "Mihawk", image: Mihawk },
    { name: "Naruto", image: Naruto },
    { name: "Nezuko", image: Nezuko },
    { name: "Rengoku", image: Rengoku },
    { name: "Sakura", image: Sakura },
    { name: "Sasuke", image: Sasuke },
    { name: "Shoto", image: Shoto },
    { name: "Tanjiro", image: Tanjiro },
    { name: "Zenitsu", image: Zenitsu },
  ],
  trungBinh: [
    { name: "Akaza", image: Akaza },
    { name: "Arceus", image: Arceus },
    { name: "Dialga", image: Dialga },
    { name: "Igris", image: Igris },
    { name: "Kyogre", image: Kyogre },
    { name: "Midoriya", image: Midoriya },
    { name: "Obito", image: Obito },
    { name: "Palkia", image: Palkia },
    { name: "Rayquaza", image: Rayquaza },
  ],
  kho: [
    { name: "Ashborn", image: Ashborn },
    { name: "Bellion", image: Bellion },
    { name: "Iron", image: Iron },
    { name: "Stain", image: Stain },
  ],
};

const shuffleArray = (array) => [...array].sort(() => 0.5 - Math.random());
const WHEEL_PRIZES = [2, 4, 6, 8, 10];

const Quiz = () => {
  const [gameState, setGameState] = useState("start");
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4);

  // States mới để quản lý trạng thái chờ 1.5s và lưu đáp án người chơi chọn
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);

  const [wheelBonus, setWheelBonus] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const startGame = () => {
    const allNames = [
      ...charactersData.de,
      ...charactersData.trungBinh,
      ...charactersData.kho,
    ].map((c) => c.name);

    const easyChars = shuffleArray(charactersData.de).slice(0, 5);
    const medChars = shuffleArray(charactersData.trungBinh).slice(0, 3);
    const hardChars = shuffleArray(charactersData.kho).slice(0, 2);

    let selectedChars = [...easyChars, ...medChars, ...hardChars];
    selectedChars = shuffleArray(selectedChars);

    const newQuestions = selectedChars.map((char) => {
      const otherNames = allNames.filter((name) => name !== char.name);
      const wrongAnswers = shuffleArray(otherNames).slice(0, 3);
      const options = shuffleArray([...wrongAnswers, char.name]);

      return {
        image: char.image,
        correctAnswer: char.name,
        options: options,
      };
    });

    setQuestions(newQuestions);
    setScore(0);
    setWheelBonus(0);
    setRotation(0);
    setCurrentQIndex(0);
    setTimeLeft(4);
    setSelectedAnswer(null);
    setIsWaiting(false);
    setGameState("playing");
  };

  useEffect(() => {
    // Nếu không ở màn hình playing, HOẶC đang trong 1.5s chờ thì dừng đếm giờ
    if (gameState !== "playing" || isWaiting) return;

    if (timeLeft <= 0) {
      // Hết giờ -> Kích hoạt trạng thái chờ 1.5s để hiện đáp án đúng rồi mới next
      setIsWaiting(true);
      setTimeout(() => {
        handleNextQuestion(false);
        setIsWaiting(false);
        setSelectedAnswer(null);
      }, 500);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameState, isWaiting]);

  const handleNextQuestion = (isCorrect) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (currentQIndex < 9) {
      setCurrentQIndex((prev) => prev + 1);
      setTimeLeft(4);
    } else {
      setGameState("spinning");
    }
  };

  const handleAnswerClick = (selectedOption) => {
    // Không cho phép bấm khi đang chờ 1.5s chuyển câu
    if (isWaiting) return;

    setSelectedAnswer(selectedOption);
    setIsWaiting(true); // Bắt đầu chờ

    const isCorrect = selectedOption === questions[currentQIndex].correctAnswer;

    // Chờ 1.5 giây để xem hiệu ứng xanh/đỏ rồi mới qua câu
    setTimeout(() => {
      handleNextQuestion(isCorrect);
      setIsWaiting(false);
      setSelectedAnswer(null);
    }, 1000);
  };

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const winIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const sliceAngle = 360 / WHEEL_PRIZES.length;
    const targetAngle = winIndex * sliceAngle + sliceAngle / 2;

    const baseSpins = 360 * 5;
    const finalRotation = baseSpins + (360 - targetAngle);

    setRotation(finalRotation);

    setTimeout(() => {
      setWheelBonus(WHEEL_PRIZES[winIndex]);
      setGameState("end");
      setIsSpinning(false);
    }, 4000);
  };

  // --- COMPONENT TÁI SỬ DỤNG ---
  const HeaderLogo = () => (
    <div className="w-full bg-[#242424] gap-3 py-3 flex flex-col items-center justify-center border-b-2 border-[#1a1a1a]">
      <img
        src={Keyrambit_Logo}
        alt="Keyrambit Logo"
        className="h-8 mb-1 object-contain"
      />
      <img
        src={Keyrambit_Word}
        alt="Keyrambit Word"
        className="h-2.5 object-contain"
      />
    </div>
  );

  const containerStyle =
    "min-h-screen bg-[#383838] text-white flex flex-col items-center font-sans selection:bg-[#CA2323] selection:text-white pb-10";

  // 1. MÀN HÌNH BẮT ĐẦU
  if (gameState === "start") {
    return (
      <div className={containerStyle}>
        <HeaderLogo />
        <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md">
          <div className="bg-[#2a2a2a] p-8 rounded-2xl shadow-2xl border border-[#444] text-center w-full mb-10">
            <div className="mb-6">
              <p className="text-gray-400 text-xs tracking-widest uppercase mb-1">
                Số lượng
              </p>
              <p className="text-xl font-light text-gray-200">10 Câu hỏi</p>
            </div>
            <div className="mb-6">
              <p className="text-gray-400 text-xs tracking-widest uppercase mb-1">
                Thời gian
              </p>
              <p className="text-xl font-light text-[#CA2323]">4s / Câu</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs tracking-widest uppercase mb-1">
                Cách Chơi
              </p>
              <p className="text-md font-light text-gray-200">
                Chọn đúng tên nhân vật trong khoảng thời gian quy định
              </p>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 bg-[#CA2323] text-white font-bold tracking-[0.15em] rounded-xl hover:bg-[#a11a1a] transition-all duration-300 active:scale-95"
          >
            BẮT ĐẦU
          </button>
        </div>
      </div>
    );
  }

  // 2. MÀN HÌNH QUAY THƯỞNG
  if (gameState === "spinning") {
    return (
      <div className={containerStyle}>
        <HeaderLogo />
        <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md overflow-hidden">
          <div className="text-center mb-12">
            <p className="text-gray-400 text-sm tracking-widest uppercase mb-2">
              Điểm hiện tại
            </p>
            <h2 className="text-5xl font-light text-[#CA2323]">
              {score}
              <span className="text-2xl text-gray-500">%</span>
            </h2>
          </div>

          <div className="relative w-80 h-80 mb-12">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-[#CA2323] z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"></div>
            <div
              className="w-full h-full rounded-full shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden border-4 border-[#2a2a2a]"
              style={{
                background: `conic-gradient(
                  #444444 0deg 72deg, 
                  #3a3a3a 72deg 144deg, 
                  #444444 144deg 216deg, 
                  #3a3a3a 216deg 288deg, 
                  #444444 288deg 360deg
                )`,
                transform: `rotate(${rotation}deg)`,
                transition: "transform 4s cubic-bezier(0.15, 0.9, 0.25, 1)",
              }}
            >
              {WHEEL_PRIZES.map((prize, index) => {
                const textRotation = index * 72 + 36;
                const isAccent = index % 2 === 0;
                return (
                  <div
                    key={index}
                    className="absolute w-full h-full flex items-start justify-center pt-8"
                    style={{
                      transform: `rotate(${textRotation}deg)`,
                      transformOrigin: "50% 50%",
                    }}
                  >
                    <span
                      className={`font-light text-2xl tracking-wider ${isAccent ? "text-[#CA2323]" : "text-gray-300"}`}
                    >
                      +{prize}%
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#2a2a2a] rounded-full border-4 border-[#383838] shadow-inner"></div>
          </div>

          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className={`w-full py-4 font-bold tracking-[0.15em] rounded-xl transition-all duration-300 ${isSpinning ? "bg-[#2a2a2a] text-gray-500 cursor-not-allowed border border-[#444]" : "bg-[#CA2323] text-white hover:bg-[#a11a1a] active:scale-95"}`}
          >
            {isSpinning ? "ĐANG QUAY..." : "QUAY NGAY"}
          </button>
        </div>
      </div>
    );
  }

  // 3. MÀN HÌNH KẾT THÚC
  if (gameState === "end") {
    const totalDiscount = score + wheelBonus;
    return (
      <div className={containerStyle}>
        <HeaderLogo />
        <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md">
          <h2 className="text-2xl font-light tracking-widest uppercase text-gray-300 mb-10">
            Hoàn thành
          </h2>

          <div className="bg-[#2a2a2a] border border-[#CA2323] rounded-2xl w-full text-center shadow-[0_15px_40px_rgba(202,35,35,0.15)] relative overflow-hidden mb-12">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#CA2323] to-transparent opacity-70"></div>

            <div className="p-8">
              <p className="text-gray-400 text-xs tracking-[0.2em] uppercase mb-4">
                Mã giảm giá của bạn
              </p>
              <p className="text-7xl font-light text-white mb-2">
                {totalDiscount}
                <span className="text-4xl text-[#CA2323]">%</span>
              </p>

              <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-[#444]">
                <div>
                  <p className="text-[#CA2323] text-lg font-light">{score}%</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                    Đố vui
                  </p>
                </div>
                <div className="w-[1px] bg-[#444]"></div>
                <div>
                  <p className="text-[#CA2323] text-lg font-light">
                    +{wheelBonus}%
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                    Vòng quay
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#CA2323] py-3">
              <p className="text-xs text-white tracking-widest uppercase font-light">
                Sử Dụng Khi Thanh Toán{" "}
              </p>
            </div>
          </div>

          {/* <button
            onClick={startGame}
            className="text-xs text-gray-500 tracking-[0.1em] uppercase hover:text-gray-300 transition-colors border-b border-transparent hover:border-gray-500 pb-1"
          >
            Chơi lại (Chế độ Test)
          </button> */}
        </div>
      </div>
    );
  }

  // 4. MÀN HÌNH ĐANG CHƠI (Áp dụng UI Mockup)
  const currentQ = questions[currentQIndex];

  // Tính toán độ dài viền đỏ của SVG dựa trên thời gian
  const circleRadius = 22;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (circumference * timeLeft) / 4;

  return (
    <div className={containerStyle}>
      <HeaderLogo />

      {/* Stats Bar Layout theo Mockup */}
      <div className="w-full max-w-md grid grid-cols-3 items-center px-4 py-6">
        {/* Left: Point Asset */}
        <div className="flex justify-start">
          <div className="relative w-[85px] h-[34px] flex items-center justify-center ml-2">
            <img
              src={Point_Asset}
              alt="Point Container"
              className="absolute inset-0 w-full h-full object-fill"
            />
            <span className="relative z-10 text-white font-medium text-[15px] tracking-wider pr-1">
              {currentQIndex + 1}/10
            </span>
          </div>
        </div>

        {/* Center: SVG Timer */}
        <div className="flex justify-center">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90 scale-x-[-1]">
              <circle
                cx="28"
                cy="28"
                r={circleRadius}
                stroke="#444"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="28"
                cy="28"
                r={circleRadius}
                stroke="#CA2323"
                strokeWidth="3"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <span className="relative z-10 text-white font-light text-xl">
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Right: Empty for Balance */}
        <div className="flex justify-end"></div>
      </div>

      {/* Ảnh nhân vật - Căn tràn viền theo Mockup */}
      <div className="w-full max-w-md aspect-video mb-12 overflow-hidden bg-[#222]">
        <img
          src={currentQ.image}
          alt="Character"
          className="w-full h-full object-contain"
        />
      </div>

      {/* 4 Đáp án (Có xử lý logic hiệu ứng Đúng/Sai) */}
      <div className="w-full max-w-md px-6 grid grid-cols-2 gap-4">
        {currentQ.options.map((option, index) => {
          // Trạng thái mặc định của nút bấm
          let buttonStyle = "bg-[#CA2323] hover:bg-[#a11a1a]";
          let icon = null;

          // Nếu đang trong thời gian 1.5s chờ
          if (isWaiting) {
            if (option === currentQ.correctAnswer) {
              // Câu đúng sẽ luôn hiện màu xanh và icon Tick
              buttonStyle =
                "bg-green-600 shadow-[0_0_15px_rgba(22,163,74,0.6)]";
              icon = (
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              );
            } else if (option === selectedAnswer) {
              // Câu người dùng chọn sai sẽ hiện màu đỏ đạm hơn và icon X
              buttonStyle =
                "bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.6)] border border-red-400";
              icon = (
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              );
            } else {
              // Các ô còn lại làm mờ đi
              buttonStyle = "bg-[#2a2a2a] text-gray-500 border border-[#444]";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerClick(option)}
              disabled={isWaiting} // Khóa không cho bấm khi đang chờ
              className={`w-full py-4 flex items-center justify-center rounded-xl font-light tracking-wide transition-all duration-200 active:scale-95 shadow-md truncate px-2 ${buttonStyle}`}
            >
              <span>{option}</span>
              {icon}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Quiz;
