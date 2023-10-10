interface HeadingProps {
  heading: string;
  subHeading?: string;
  children?: React.ReactNode;
}

export const Heading = ({ heading, subHeading, children }: HeadingProps) => {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="grid gap-1">
        <h1 className="justify-between text-3xl font-bold md:text-4xl">
          {heading}
        </h1>
        {subHeading && (
          <p className="text-md text-muted-foreground">{subHeading}</p>
        )}
      </div>
      {children}
    </div>
  );
};
