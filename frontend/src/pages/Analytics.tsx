import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Analytics = () => {
  return (
    <div className="w-full min-h-0">
      <span className="text-2xl font-medium">Phân tích dữ liệu</span>
      {/* <Tabs defaultValue="gene-expression" className="flex flex-col">
        <TabsList className="flex gap-1 bg-white rounded-t-md shadow max-w-fit">
          <TabsTrigger
            value="gene-expression"
            className="data-[state=active]:bg-accent data-[state=active]:text-white rounded"
          >
            Biểu hiện gen
          </TabsTrigger>
          <TabsTrigger
            value="cnv"
            className="data-[state=active]:bg-accent data-[state=active]:text-white rounded"
          >
            Số lượng bản sao (CNV)
          </TabsTrigger>
          <TabsTrigger
            value="dna-methyl"
            className="data-[state=active]:bg-accent data-[state=active]:text-white rounded"
          >
            Methyl hóa DNA
          </TabsTrigger>
          <TabsTrigger
            value="miRNA"
            className="data-[state=active]:bg-accent data-[state=active]:text-white rounded"
          >
            RNA nhỏ (miRNA)
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 p-2 rounded-b-md overflow-auto mt-5">
          <TabsContent value="dna-methyl">
            <DnaAnalytics />
          </TabsContent>
          <TabsContent value="gene-expression">
            <GeneAnalytics />
          </TabsContent>
        </div>
      </Tabs> */}
    </div>
  );
};

export default Analytics;
