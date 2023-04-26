import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'

const createUserFormSchema = z.object({
  name: z
    .string()
    .nonempty('O nome é obrigatório')
    .transform((name) => {
      return name
        .trim()
        .toLocaleLowerCase()
        .split(' ')
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1))
        })
        .join(' ')
    }),
  email: z
    .string()
    .nonempty('O e-mail é obrigatório')
    .email('Formato de e-mail inválido')
    .toLowerCase()
    .refine((email) => {
      return email.endsWith('@rocketseat.com.br')
    }, 'O e-mail precisa ser da Rocketseat'),
  password: z.string().min(6, 'A senha precisa de no mínimo 6 caracteres'),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty('O título é obrigatório'),
        knowledge: z.coerce.number().min(1).max(100),
      }),
    )
    .min(2, 'Insira pelo menos duas tecnologias')
    .refine((techs) => {
      return techs.some((tech) => tech.knowledge > 50)
    }, 'Você está aprendendo'),
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>

export function App() {
  const [output, setOutput] = useState('')
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

  const { fields, append } = useFieldArray({
    control,
    name: 'techs',
  })

  function addNewTech() {
    append({ title: '', knowledge: 0 })
  }

  function createUser(data: CreateUserFormData) {
    setOutput(JSON.stringify(data, null, 2))
  }

  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center">
      <form
        className="flex flex-col gap-4 w-full max-w-xs"
        onSubmit={handleSubmit(createUser)}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            className="border border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white"
            {...register('name')}
          />
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            className="border border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white"
            {...register('email')}
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            className="border border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white"
            {...register('password')}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="flex items-center justify-between"
          >
            Tecnologias
            <button
              className="text-emerald-500 text-xs"
              type="button"
              onClick={addNewTech}
            >
              Adicionar
            </button>
          </label>

          {fields.map((field, index) => {
            return (
              <div className="flex gap-2" key={field.id}>
                <div className="flex-1 flex flex-col gap-1">
                  <input
                    type="text"
                    className="border border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white"
                    {...register(`techs.${index}.title`)}
                  />

                  {errors.techs?.[index]?.title && (
                    <span className="text-red-500">
                      {errors.techs?.[index]?.title?.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    type="number"
                    className="w-16 border border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white"
                    {...register(`techs.${index}.knowledge`)}
                  />
                  {errors.techs?.[index]?.knowledge && (
                    <span className="text-red-500">
                      {errors.techs?.[index]?.knowledge?.message}
                    </span>
                  )}
                </div>
              </div>
            )
          })}

          {errors.techs && (
            <span className="text-red-500">{errors.techs.message}</span>
          )}
        </div>

        <button
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600"
          type="submit"
        >
          Salvar
        </button>
      </form>

      <pre>{output}</pre>
    </main>
  )
}

export default App
