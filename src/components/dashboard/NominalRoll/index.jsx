import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import dayjs from "dayjs";
import { Combobox } from "@/components/shared/Combobox";
import { createClient } from "@/lib/supabase/component";
import { recursiveCamelCase } from "@/lib/utils";
import { DataTable } from "@/components/shared/Table/DataTable";
import { NOMINAL_ROLL_COLUMNS, PLATOONS } from "@/lib/data";

const NominalRoll = () => {
  const [data, setData] = useState([]);
  const [allPersonnel, setAllPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [platoon, setPlatoon] = useState("all");
  const supabaseClient = createClient();

  useEffect(() => {
    if (platoon === "") return;
    (async () => {
      setLoading(true);
      const { data: allPersonnel, error: error1 } = await supabaseClient
        .from("profiles")
        .select();
      if (error1) {
        console.error(error1);
      }
      setData(recursiveCamelCase(allPersonnel));
      setAllPersonnel(recursiveCamelCase(allPersonnel));
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    setLoading(true);
    if (platoon === "all") {
      setData(JSON.parse(JSON.stringify(allPersonnel)));
    } else {
      setData(
        allPersonnel.filter(
          (onePersonnel) => onePersonnel.platoon?.toLowerCase() === platoon
        )
      );
    }
    setLoading(false);
  }, [platoon]);

  return (
    <div className="flex flex-col mt-4">
      <span className="flex justify-between space-x-4 items-center mb-4">
        <span>
          <h2 className="font-semibold text-lg">Nominal Roll</h2>
          <p className="text-sm text-left text-slate-500">
            Duty points are added at the end of every month.
          </p>
        </span>
        <span className="flex gap-x-4">
          <Combobox
            value={platoon}
            setValue={setPlatoon}
            data={PLATOONS}
            placeholder="Search platoon"
          />
        </span>
      </span>
      {/* List */}
      <div>
        {loading ? (
          <span className="w-full h-full flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </span>
        ) : (
          <DataTable
            className="mt-4"
            columns={NOMINAL_ROLL_COLUMNS}
            data={data || []}
            setData={setData}
            state={{
              columnVisibility: {
                id: false
              }
            }}
            search
            downloadable
            csvFileName={`charlie_nominal_roll_d_${dayjs().format("DDMMYYYY")}.csv`}
          />
        )}
      </div>
    </div>
  );
};

export default NominalRoll;
