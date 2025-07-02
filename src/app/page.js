import CreateInvoice from "@/components/invoice/CreateInvoice";
import ListInvoice from "@/components/invoice/ListInvoice";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="flex justify-center min-h-[82vh]">
      <section className="w-full px-4 sm:px-6 md:px-8 max-w-[1400px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
            Invoice Manager App
          </h2>
          <div className="flex justify-center sm:justify-end">
            <CreateInvoice />
          </div>
        </div>

        <Separator className="my-4 border-b-[2px] border-color-light-blue" />
        <ListInvoice />
      </section>
    </div>
  );
}
