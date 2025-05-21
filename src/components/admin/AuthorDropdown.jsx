
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { AuthorApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const AuthorDropdown = ({ register, watch, setValue, errors }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState({ name: '' });
  const [editAuthor, setEditAuthor] = useState({ id: null, name: '' });
  const [authorToDelete, setAuthorToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  
  // Get the current authorId value
  const selectedAuthorId = watch("authorId");
  
  // Use Tanstack Query to fetch authors
  const { 
    data: authorsData = [], 
    isLoading: isAuthorsLoading,
    isError: isAuthorsError,
    refetch: refetchAuthors
  } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      try {
        const response = await AuthorApi.getAllAuthors();
        return response.data.authors;
      } catch (error) {
        console.error("Error fetching authors:", error);
        const errorMessage = 
          error.response?.data?.message || 
          error.message || 
          "Failed to load authors";
        toast.error(errorMessage);
        throw error;
      }
    }
  });
  
  // Use the authors data from the query
  const authors = authorsData;
  
  const handleCreateAuthor = async () => {
    try {
      if (!newAuthor.name.trim()) {
        toast.error("Author name is required");
        return;
      }

      await AuthorApi.createAuthor(newAuthor);
      toast.success("Author created successfully");
      setNewAuthor({ name: '' });
      setIsCreateOpen(false);
      refetchAuthors(); // Use refetch from Tanstack Query
    } catch (error) {
      console.error("Error creating author:", error);
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Failed to create author";
      toast.error(errorMessage);
    }
  };

  const handleEditAuthor = async () => {
    try {
      if (!editAuthor.name.trim()) {
        toast.error("Author name is required");
        return;
      }

      await AuthorApi.updateAuthor(editAuthor.id, {
        name: editAuthor.name
      });
      toast.success("Author updated successfully");
      setIsEditOpen(false);
      refetchAuthors(); // Use refetch from Tanstack Query
    } catch (error) {
      console.error("Error updating author:", error);
      toast.error(error.response?.data?.message || "Failed to update author");
    }
  };

  const handleDeleteAuthor = async () => {
    try {
      setDeleteError(null);
      await AuthorApi.deleteAuthor(authorToDelete);
      toast.success("Author deleted successfully");
      setIsDeleteOpen(false);
      refetchAuthors(); // Use refetch from Tanstack Query
      
      // If the deleted author was selected, reset the selection
      if (selectedAuthorId === authorToDelete) {
        setValue("authorId", "");
      }
    } catch (error) {
      console.error("Error deleting author:", error);
      if (error.response?.data?.message?.includes("Cannot delete author")) {
        setDeleteError(error.response.data.message);
      } else {
        toast.error("Failed to delete author");
        setIsDeleteOpen(false);
      }
    }
  };

  const openEditDialog = (author) => {
    setEditAuthor({
      id: author._id,
      name: author.name
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (authorId) => {
    setAuthorToDelete(authorId);
    setDeleteError(null);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="authorId">Author <span className="text-red-500">*</span></Label>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Add New</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Author</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="new-author-name">Name</Label>
                <Input 
                  id="new-author-name"
                  value={newAuthor.name}
                  onChange={(e) => setNewAuthor({...newAuthor, name: e.target.value})}
                  placeholder="Author name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateAuthor}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {isAuthorsLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <div className="flex space-x-1">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <select
            className="col-span-9 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            id="authorId"
            {...register("authorId", { required: "Author is required" })}
          >
            <option value="">Select Author</option>
            {authors.map((author) => (
              <option key={author._id} value={author._id}>
                {author.name}
              </option>
            ))}
          </select>
        
        <div className="col-span-3 flex space-x-1">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                disabled={!selectedAuthorId} 
                className="flex-1"
                onClick={() => {
                  const selectedAuthor = authors.find(a => a._id === selectedAuthorId);
                  if (selectedAuthor) {
                    openEditDialog(selectedAuthor);
                  }
                }}
              >
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Author</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-author-name">Name</Label>
                  <Input 
                    id="edit-author-name"
                    value={editAuthor.name}
                    onChange={(e) => setEditAuthor({...editAuthor, name: e.target.value})}
                    placeholder="Author name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button onClick={handleEditAuthor}>Update</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="icon" 
                disabled={!selectedAuthorId}
                className="flex-1"
                onClick={() => {
                  openDeleteDialog(selectedAuthorId);
                }}
              >
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Author</DialogTitle>
              </DialogHeader>
              <div className="py-3">
                <p>Are you sure you want to delete this author?</p>
                {deleteError && (
                  <p className="text-red-500 mt-2">{deleteError}</p>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteAuthor} disabled={deleteError}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      )}

      {errors.authorId && (
        <p className="text-sm text-red-500">{errors.authorId.message}</p>
      )}
    </div>
  );
};

export default AuthorDropdown;
