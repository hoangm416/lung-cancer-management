import CNVAnalytics from "@/components/CNVAnalytics";
import GeneAnalytics from "@/components/GeneAnalytics";
import MethylAnalytics from "@/components/MethylAnalytics";
import RNAAnalytics from "@/components/RNAAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Analytics = () => {
  return (
    // nếu header đang fixed cao h-16 thì để pt-16, hoặc pt-10 nếu header của bạn cao 40px
    <div className="w-full min-h-0">
      <Tabs defaultValue="gene-expression" className="flex flex-col w-full">
        {/* tabs ngang trên cùng */}
        <TabsList className="flex space-x-2 bg-white p-2 rounded-t-md shadow justify-end">
          <TabsTrigger
            value="gene-expression"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded"
          >
            Biểu hiện gen
          </TabsTrigger>
          <TabsTrigger
            value="cnv"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded"
          >
            Số lượng bản sao (CNV)
          </TabsTrigger>
          <TabsTrigger
            value="dna-methyl"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded"
          >
            Methyl hóa DNA
          </TabsTrigger>
          <TabsTrigger
            value="miRNA"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded"
          >
            RNA nhỏ (miRNA)
          </TabsTrigger>
        </TabsList>

        {/* content bên dưới, full width */}
        <div className="flex-1 p-2 rounded-b-md overflow-auto mt-5">
          <TabsContent value="cnv">
            <CNVAnalytics />
          </TabsContent>
          <TabsContent value="dna-methyl">
            <MethylAnalytics />
          </TabsContent>
          <TabsContent value="miRNA">
            <RNAAnalytics />
          </TabsContent>
          <TabsContent value="gene-expression">
            <GeneAnalytics />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Analytics;
