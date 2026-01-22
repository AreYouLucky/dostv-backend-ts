
import { ResponsivePie } from "@nivo/pie";
import { CardSkeleton } from "@/components/custom/card-skeleton";
type PieData = {
    id: string;
    label: string;
    value: number;
};
import { useFetchProgramCount } from "./dashboard-hooks";

export default function CategoryPieChart() {
    const { data, isLoading } = useFetchProgramCount();

    if (isLoading) return
    <div className=" flex justify-center  flex-col rounded-2xl bg-white/80 shadow-md">
        <CardSkeleton type="single" />;
    </div>

    if (!data || data.length === 0) return <div>No data</div>;

    const pieData: PieData[] = data.map(item => ({
        id: item.title,
        label: item.title,
        value: item.post_categories_count,
    }));

    return (
        <div className="w-full h-full min-h-80 p-4 md:p-6 rounded-2xl bg-white/80 shadow-md hover:shadow-lg transition-transform flex flex-col gap-4 hover:scale-102 duration-200">
            <div>
                <p className="text-[13px] uppercase tracking-wider text-teal-700 font-bold">
                    Number of Post per Category
                </p>
            </div>
            <ResponsivePie
                data={pieData}
                colors={{ scheme: "green_blue" }}
                margin={{ top: 40, right: 270, bottom: 80, left: 20 }}
                innerRadius={0.40}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: "color" }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                    from: "color",
                    modifiers: [["darker", 2]],
                }}
                legends={[
                    {
                        anchor: "right",
                        direction: "column",
                        justify: false,
                        translateX: 170,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemsSpacing: 6,
                        itemTextColor: "#999",
                        symbolSize: 18,
                        symbolShape: "circle",
                        effects: [
                            {
                                on: "hover",
                                style: {
                                    itemTextColor: "#000",
                                },
                            },
                        ],
                    },
                ]}
            />
        </div>
    );
}
