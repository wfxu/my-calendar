function Detail({ num}: {num: number}) {
  return (
    <div className="flex w-full items-start justify-center border border-gray-200 border-t-0 border-l-0"> {num} </div>
  )
}

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center p-10">
      <div className="flex h-full w-full flex-row space-x-4 p-4">
        <div className="flex h-full w-full basis-4/5 flex-col border-2 border-gray-200">
          <div className="basis-1/12 flex justify-center">
            <div className="flex flex-col items-center justify-center">
              <p>星期三</p>
              <p className="text-xs">9-18</p>
            </div>
          </div>
          <div className="border border-gray-200"></div>
          <div className="grid w-full grow grid-cols-7 grid-rows-5 justify-items-center">
            {Array.from({ length: 35}, (_, i) => i).map((item) => <Detail key={item} num={item} />) }
          </div>
        </div>
        <div className="basis-1/5 border-2 border-gray-200"></div>
      </div>
    </div>

  )
}