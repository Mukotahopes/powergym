type NewsCardProps = {
    title: string;
    shortDescription: string;
    image?: string;
    publishedAt?: string;
    onDetails: () => void;
  };
  
  export default function NewsCard({
    title,
    shortDescription,
    image,
    publishedAt,
    onDetails,
  }: NewsCardProps) {
    const date =
      publishedAt && !Number.isNaN(Date.parse(publishedAt))
        ? new Date(publishedAt).toLocaleDateString("uk-UA")
        : null;
  
    return (
      <article className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-md shadow-black/10 transition-transform hover:-translate-y-1 hover:shadow-xl">
        {image && (
          <div className="h-40 w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={title} className="h-full w-full object-cover" />
          </div>
        )}
  
        <div className="flex flex-1 flex-col gap-2 p-4">
          {date && <span className="text-xs text-black/50">{date}</span>}
          <h3 className="text-base font-semibold text-black text-center">{title}</h3>
          <p className="mt-1 text-sm text-black/70 text-center">{shortDescription}</p>
  
          <div className="mt-3 flex justify-center">
            <button
              onClick={onDetails}
              className="rounded-full bg-gradient-to-b from-primary to-[#6fd6a7] px-6 py-1.5 text-xs font-semibold text-black shadow-sm hover:shadow-md active:scale-95"
            >
              Детальніше
            </button>
          </div>
        </div>
      </article>
    );
  }
  