import { useQuery } from '@tanstack/react-query';
import { Controller } from 'react-hook-form';
import { ColorPicker } from '@/components/ui/color-picker';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import AutocompleteInput from '@/components/ui/autocomplete-input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import FiberChips from '@/components/ui/fiber-chips';
import { api } from '@/api/api';
import useFetchBrands from '@/hooks/useFetchBrands';
import useFetchFibers from '@/hooks/useFetchFibers';
import type { SkeinItem } from '@/lib/types';
import useSkeinForm from '@/hooks/useSkeinForm';

interface SkeinFormProps {
  skein?: SkeinItem;
  onClose: () => void;
}

export default function SkeinForm({ skein, onClose }: SkeinFormProps) {
  const { isDirty, control, register, onSubmit, handleSubmit, errors, setValue, mutation } =
    useSkeinForm({
      skein,
      onClose,
    });
  const { data: brands = [], isLoading: isBrandsLoading } = useFetchBrands();
  const { data: fibers = [], isLoading: isFibersLoading } = useFetchFibers();

  const { data: yardageUnits = [], isLoading: isYardageUnitsLoading } = useQuery({
    queryKey: ['yardageUnits'],
    queryFn: api.getYardageUnits,
  });

  const { data: suggestions = [] } = useQuery({
    queryKey: ['skeinNames'],
    queryFn: api.getSkeinNames,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <FieldGroup>
          <Field>
            <FieldLabel>Brand</FieldLabel>
            <Controller
              name="brand_id"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={isBrandsLoading}
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={isBrandsLoading ? 'Loading...' : 'Select from the list'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Brands</SelectLabel>
                      {brands.map((b) => (
                        <SelectItem key={b.id} value={String(b.id)}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.brand_id && (
              <p className="text-sm text-destructive">{errors.brand_id.message}</p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="skein-name">Name</FieldLabel>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <AutocompleteInput
                  id="skein-name"
                  placeholder="Lanagold"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={suggestions.map((s) => ({ label: s.name, value: s.name }))}
                  onSelect={(value) => {
                    const match = suggestions.find((s) => s.name === value);
                    if (match) {
                      setValue('name', match.name);
                      setValue('yardage', match.yardage);
                      setValue('yardage_unit', match.yardage_unit);
                      setValue('fibers', match.fibers);
                    }
                  }}
                />
              )}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </Field>

          <Field>
            <FieldLabel htmlFor="skein-color">Color</FieldLabel>
            <div className="w-fit">
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <ColorPicker value={field.value} onChange={field.onChange} id="skein-color" />
                )}
              />
            </div>
          </Field>

          <div className="grid grid-cols-[1fr_2fr] gap-4">
            <Field>
              <FieldLabel htmlFor="weight-in-stash">Weight in stash</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="weight-in-stash"
                  placeholder="100"
                  {...register('weight', { valueAsNumber: true })}
                />
                <InputGroupAddon align="inline-end">g</InputGroupAddon>
              </InputGroup>
              {errors.weight && <p className="text-sm text-destructive">{errors.weight.message}</p>}
            </Field>

            <Field>
              <FieldLabel htmlFor="yardage">Yardage</FieldLabel>
              <div className="flex items-center gap-2">
                <InputGroup className="flex-1">
                  <InputGroupInput id="yardage" placeholder="200" {...register('yardage')} />
                  <InputGroupAddon align="inline-end">m</InputGroupAddon>
                </InputGroup>
                <span className="text-sm text-muted-foreground shrink-0">per</span>
                <Controller
                  name="yardage_unit"
                  control={control}
                  render={({ field }) => (
                    <Select
                      disabled={isYardageUnitsLoading}
                      value={field.value ?? ''}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder={isYardageUnitsLoading ? 'Loading...' : '50g'} />
                      </SelectTrigger>
                      <SelectContent>
                        {yardageUnits.map((yu) => (
                          <SelectItem key={yu} value={yu}>
                            {yu}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {errors.yardage_unit && (
                <p className="text-sm text-destructive">{errors.yardage_unit.message}</p>
              )}
            </Field>
          </div>

          <Field>
            <FieldLabel>Fiber contents</FieldLabel>
            <Controller
              name="fibers"
              control={control}
              render={({ field }) => {
                const selected = field.value ?? [];
                return (
                  <FiberChips
                    fibers={fibers}
                    selected={selected}
                    isLoading={isFibersLoading}
                    onToggle={(fiber) =>
                      field.onChange(
                        selected.includes(fiber)
                          ? selected.filter((x) => x !== fiber)
                          : [...selected, fiber],
                      )
                    }
                  />
                );
              }}
            />
          </Field>

          <Field>
            <FieldLabel>Comment</FieldLabel>
            <Textarea placeholder="Any notes about this skein..." {...register('comment')} />
          </Field>
        </FieldGroup>

        <Button type="submit" className="w-full" disabled={mutation.isPending || !isDirty}>
          {mutation.isPending ? 'Saving...' : skein ? 'Save changes' : 'Save skein'}
        </Button>

        {errors && (
          <p className="text-sm text-destructive text-center">{mutation.error?.message}</p>
        )}
      </div>
    </form>
  );
}
