function Frame() {
  return (
    <div className="h-[27px] relative rounded-[4px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[10px] py-[4px] relative size-full">
          <p className="font-['Avenir_Next:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#111] text-[14px] whitespace-nowrap">Change TOD</p>
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
      <Frame />
    </div>
  );
}

function Frame1() {
  return (
    <div className="h-[27px] relative rounded-[4px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[10px] py-[4px] relative size-full">
          <p className="font-['Avenir_Next:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#111] text-[14px] whitespace-nowrap">Set Recovery</p>
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
      <Frame1 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-[rgba(17,17,17,0.1)] h-[27px] relative rounded-[4px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[10px] py-[4px] relative size-full">
          <p className="font-['Avenir_Next:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#111] text-[14px] whitespace-nowrap">Flat rate</p>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
      <Frame4 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="h-[27px] relative rounded-[4px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[10px] py-[4px] relative size-full">
          <p className="font-['Avenir_Next:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#111] text-[14px] whitespace-nowrap">Protect meter</p>
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
      <Frame8 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="h-[27px] relative rounded-[4px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[10px] py-[4px] relative size-full">
          <p className="font-['Avenir_Next:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#ec3636] text-[14px] whitespace-nowrap">Disconnect</p>
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
      <Frame10 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full">
      <Frame5 />
      <Frame6 />
      <Frame2 />
      <Frame7 />
      <Frame9 />
    </div>
  );
}

export default function Frame11() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start p-[4px] relative rounded-[8px] size-full">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[4px_4px_8px_0px_rgba(193,252,211,0.2)]" />
      <Frame3 />
    </div>
  );
}