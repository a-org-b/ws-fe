import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Transaction {
  transaction_hash: string;
}

interface NFT {
  NFTCount: number;
  image_uri?: string;
  name: string;
  value: string;
}

interface NewCardProps {
  address?: string;
  value?: number;
  transaction_hash?: string;
  allTransactions?: Transaction[] | null;
  NFTransaction?: NFT[] | null;
}

export const NewCard: React.FC<NewCardProps> = ({
  allTransactions,
  NFTransaction,
  address,
  value,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        {NFTransaction &&
          NFTransaction.map((data, ind) => (
            <Avatar key={ind} className="h-9 w-9">
              <AvatarImage src={data.image_uri} alt="Avatar" />
              <AvatarFallback>Img</AvatarFallback>
            </Avatar>
          ))}

        {allTransactions &&
          allTransactions.map((data, ind: number) => (
            <p key={ind} className="">
              {data.transaction_hash}
            </p>
          ))}

        <div className="ml-4 space-y-1">
          <p className="text-sm text-muted-foreground ">{address}</p>
        </div>
        <div className="ml-auto font-medium">
          {value} <span>Matic</span>
        </div>
      </div>
    </div>
  );
};
