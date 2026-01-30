import React, { useState } from "react"
import { type BreadcrumbItem } from "@/types"
import AppLayout from "@/layouts/app-layout"
import { Head, usePage } from "@inertiajs/react"
import { ProgramsModel, ProgramSeasonModel } from "@/types/models"
import LoadingDialog from "@/components/custom/loading-dialog"
import FileUpload from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/text-area"
import InputError from "@/components/input-error"
import { Trash2, Plus } from "lucide-react"
import { nanoid } from "nanoid"
import axios from "axios"
import { FaUpload } from "react-icons/fa"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Programs", href: "/view-programs" },
    { title: "Season Form", href: "/program-seasons" },
]

type SeasonForm = {
    uuid: string;
    title: string;
    season: string;
    description: string;
    imageFile: File | null;
    thumbnail: string | null;
}

function ProgramSeasons() {
    const { props } = usePage<{
        program_details?: ProgramsModel | null
        program_seasons?: ProgramSeasonModel[] | null}>()

    const program = props.program_details
    const [processing, setProcessing] = useState(false)
    const [fieldErrors,setFieldErrors] = useState<Record<string, string>>({})
    const [seasons, setSeasons] = useState<SeasonForm[]>(
        props.program_seasons?.map((season): SeasonForm => ({
            uuid: nanoid(),
            title: season.title ?? "",
            season: String(season.season ?? ""),
            description: season.description ?? "",
            thumbnail: season.thumbnail ?? '',
            imageFile: null,
        })) ?? []
    )

    const addSeason = () => {
        setSeasons(prev => [
            ...prev,
            {
                uuid: nanoid(),
                title: "",
                season: "",
                description: "",
                imageFile: null,
                thumbnail: '',
            },
        ])
    }

    const removeSeason = (uuid: string) => {
        setSeasons(prev => prev.filter(season => season.uuid !== uuid))
    }

    const updateSeason = <K extends keyof SeasonForm>(
        uuid: string,
        field: K,
        value: SeasonForm[K]
    ) => {
        setSeasons(prev =>
            prev.map(season =>
                season.uuid === uuid
                    ? { ...season, [field]: value }
                    : season
            )
        )
    }

    const fieldError = (index: number, field: keyof SeasonForm) => {
        return fieldErrors[`seasons.${index}.${field}`]
    }


    const uploadSeasons = () => {
        setProcessing(true)
        setProcessing(true)

        const form = new FormData()

        seasons.forEach((season, index) => {
            form.append(`seasons[${index}][title]`, season.title)
            form.append(`seasons[${index}][season]`, season.season)
            form.append(`seasons[${index}][description]`, season.description)
            if (season.imageFile) {
                form.append(`seasons[${index}][thumbnail]`, season.imageFile)
            }
        })
        axios.post(`/save-program-seasons/${program?.program_id}`, form, { headers: { "Content-Type": "multipart/form-data" }, })
            .then(
                () => {
                    setProcessing(false)
                    toast.success("Seasons updated successfully")
                    window.location.reload()
                }
            ).catch((err) => {
                setProcessing(false)
                setFieldErrors(err.response.data.errors)
            })
    }

    return (
        <>
            <Head title="Program Seasons" />

            <div className="flex flex-col gap-3 px-6 py-5">
                <div className="bg-teal-700 rounded-lg  p-4 flex items-center gap-4 justify-between">
                    <div className="flex item-center gap-3">
                        <div className="text-white   text-xl poppins-bold flex items-center uppercase">
                            {program?.title}
                        </div>
                    </div>
                    <div>
                        <Button onClick={addSeason} className="bg-white text-black hover:bg-teal-50">
                            <Plus className="w-4 h-4" />
                            Add Season
                        </Button>
                    </div>
                </div>


                {seasons.map((item, index) => (
                    <div
                        key={item.uuid}
                        className="border rounded-lg p-8 shadow-sm space-y-4 relative bg-white/90"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSeason(item.uuid)}
                            className="absolute top-3 right-3 text-red-600 hover:bg-teal-100"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="grid md:grid-cols-2 gap-4 ">
                            <div className="space-y-2 border-r px-4">
                                <Label>Season's Thumbnail</Label>
                                <FileUpload
                                    id={`season-image-${item.uuid}`}
                                    name={`seasons[${index}][image]`}
                                    type={2}
                                    accept="image/png,image/jpeg"
                                    url={item.thumbnail ? `/storage/images/program_images/seasons/${item.thumbnail}` : ""}
                                    text="Click to upload image"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] ?? null
                                        updateSeason(item.uuid, "imageFile", file)
                                    }}
                                />

                                <InputError message={fieldError(index, "thumbnail")} />
                            </div>
                            <div className="flex items-center w-full ">
                                <div className=" grid md:grid-cols-2 gap-4 h-fit w-full">
                                    <div className="space-y-2">
                                        <Label>Season Title</Label>
                                        <Input
                                            value={item.title}
                                            onChange={e =>
                                                updateSeason(
                                                    item.uuid,
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError message={fieldError(index, "title")} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Season No.</Label>
                                        <Input
                                            type="number"
                                            value={item.season}
                                            onChange={e =>
                                                updateSeason(
                                                    item.uuid,
                                                    "season",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError message={fieldError(index, "season")} />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            rows={8}
                                            value={item.description}
                                            onChange={e =>
                                                updateSeason(
                                                    item.uuid,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError message={fieldError(index, "description")} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {
                    seasons.length > 0 && <div className="flex gap-4">
                        <Button className="bg-teal-700 px-6" onClick={uploadSeasons}>{processing ? <Spinner className="mr-1" /> : <FaUpload className="mr-1" />}Save Seasons</Button>
                    </div>
                }


            </div>
            <LoadingDialog show={processing} message={'Uploading Season Details ...'} />
        </>
    )
}

ProgramSeasons.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
)

export default ProgramSeasons
